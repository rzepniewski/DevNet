#!/bin/bash
#
# DeckCraft Build Script
# Combines individual slide HTML files into a single presentation.html
#
# Usage: ./build.sh <presentation-dir> [config.json]
#
# Example:
#   ./build.sh presentations/tech-startup
#   ./build.sh presentations/corporate presentations/corporate/config.json
#
# Requirements:
# - jq (for JSON parsing)
# - Slide files in <presentation-dir>/slides/ directory (any .html files)
#
# Directory Structure:
#   lib/                          # Library source code (CSS, JS, profiles)
#   presentations/
#     tech-startup/
#       slides/                   # Slide HTML files
#       config.json               # Presentation config
#       output/                   # Build output (created by script)
#         presentation.html
#

set -e

# Script directory (where build.sh lives)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Library directory
# Check for lib in same directory (user workspace) or ../assets/lib (repo structure)
if [[ -d "$SCRIPT_DIR/lib" ]]; then
    LIB_DIR="$SCRIPT_DIR/lib"
elif [[ -d "$SCRIPT_DIR/../assets/lib" ]]; then
    LIB_DIR="$SCRIPT_DIR/../assets/lib"
else
    echo -e "\033[0;31m[ERROR]\033[0m Library directory not found. Expected at $SCRIPT_DIR/lib or $SCRIPT_DIR/../assets/lib"
    exit 1
fi

# Presentation directory (required first argument)
if [[ -z "$1" ]]; then
    echo "Usage: ./build.sh <presentation-dir> [config.json]"
    echo ""
    echo "Example:"
    echo "  ./build.sh presentations/tech-startup"
    echo "  ./build.sh presentations/corporate"
    echo ""
    echo "Available presentations:"
    if [[ -d "$SCRIPT_DIR/presentations" ]]; then
        for dir in "$SCRIPT_DIR/presentations"/*/; do
            if [[ -d "$dir" ]]; then
                echo "  - presentations/$(basename "$dir")"
            fi
        done
    fi
    exit 1
fi

# Make presentation directory path absolute if relative
# Resolve relative to current working directory, not script directory
if [[ "$1" != /* ]]; then
    PRESENTATION_DIR="$(pwd)/$1"
else
    PRESENTATION_DIR="$1"
fi

# Validate presentation directory exists
if [[ ! -d "$PRESENTATION_DIR" ]]; then
    echo -e "\033[0;31m[ERROR]\033[0m Presentation directory not found: $PRESENTATION_DIR"
    exit 1
fi

# Configuration file (default: config.json in presentation directory)
CONFIG_FILE="${2:-$PRESENTATION_DIR/config.json}"

# Default configuration values
DEFAULT_TITLE="Presentation"
DEFAULT_THEME="mesh"
DEFAULT_OUTPUT_DIR="presentation"
DEFAULT_SECTIONS='[]'
DEFAULT_INLINE_THRESHOLD=10240  # 10KB in bytes

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validation error/warning formatters (for detailed validation output)
validation_error() {
    echo -e "${RED}ERROR:${NC} $1"
}

validation_warning() {
    echo -e "${YELLOW}WARNING:${NC} $1"
}

validation_hint() {
    echo -e "  ${YELLOW}->${NC} $1"
}

# Helper: Extract data-order value from HTML content (macOS compatible)
extract_data_order() {
    echo "$1" | sed -n 's/.*data-order=["\x27]\([0-9]*\).*/\1/p' | head -1
}

# Helper: Extract src attribute values from a line (macOS compatible)
extract_src_values() {
    echo "$1" | sed -n 's/.*src=["\x27]\([^"\x27]*\).*/\1/gp' | tr '\n' ' '
}

# Validate all slide files before building
# Returns 0 if valid, 1 if errors found (warnings don't cause failure)
validate_slides() {
    log_info "Validating slides..."
    echo ""

    local SLIDES_DIR="$PRESENTATION_DIR/slides"
    local ERROR_COUNT=0
    local WARNING_COUNT=0

    # 1. Check slides/ directory exists
    if [[ ! -d "$SLIDES_DIR" ]]; then
        validation_error "slides/ directory not found"
        validation_hint "Create the slides/ directory at: $SLIDES_DIR"
        return 1
    fi

    # Find all slide files
    local SLIDE_FILES=()
    while IFS= read -r -d '' file; do
        SLIDE_FILES+=("$file")
    done < <(find "$SLIDES_DIR" -maxdepth 1 -name '*.html' -print0 2>/dev/null)

    if [[ ${#SLIDE_FILES[@]} -eq 0 ]]; then
        validation_error "No slide files found in slides/"
        validation_hint "Add .html slide files to the slides/ directory"
        return 1
    fi

    # Track data-order values for duplicate detection using temp file
    local ORDER_TRACKING_FILE=$(mktemp)
    trap "rm -f '$ORDER_TRACKING_FILE'" EXIT

    # Validate each slide file
    for file in "${SLIDE_FILES[@]}"; do
        local filename=$(basename "$file")
        local file_content=$(cat "$file")

        # 2. Check for data-order attribute (macOS compatible)
        local data_order=$(extract_data_order "$file_content")
        if [[ -z "$data_order" ]]; then
            validation_error "[$filename] Missing data-order attribute"
            validation_hint "Add data-order=\"N\" to the root <div class=\"slide\"> element"
            ((ERROR_COUNT++))
        else
            # Track for duplicate detection
            echo "$data_order:$file" >> "$ORDER_TRACKING_FILE"
        fi

        # 4. Check slide structure - root element must have class="slide"
        # Look for a div with class containing "slide" (macOS compatible grep -E)
        if ! echo "$file_content" | grep -qE '<div[^>]*class="[^"]*slide'; then
            validation_error "[$filename] Missing slide class on root element"
            validation_hint "Root element must be: <div class=\"slide\" ...>"
            ((ERROR_COUNT++))
        fi

        # 6. Check for data-section attribute (warning only)
        if ! echo "$file_content" | grep -q 'data-section='; then
            validation_warning "[$filename] Missing data-section attribute"
            validation_hint "Section indicators won't work correctly for this slide"
            ((WARNING_COUNT++))
        fi

        # 5. Check for missing referenced assets (images)
        local line_num=0
        while IFS= read -r line; do
            ((line_num++))
            # Extract img src attributes (macOS compatible)
            local img_srcs=$(extract_src_values "$line")
            for src in $img_srcs; do
                # Skip external URLs (http://, https://, data:, //)
                if [[ "$src" =~ ^(https?://|data:|//) ]]; then
                    continue
                fi
                # Check if it looks like an image
                if [[ "$src" =~ \.(png|jpg|jpeg|gif|svg|webp)$ ]]; then
                    # Check if file exists relative to presentation directory
                    local asset_path="$PRESENTATION_DIR/$src"
                    # Also check relative to slides directory
                    local asset_path_slides="$SLIDES_DIR/$src"

                    if [[ ! -f "$asset_path" && ! -f "$asset_path_slides" ]]; then
                        validation_warning "[$filename:$line_num] Referenced asset not found: $src"
                        validation_hint "Ensure the file exists at: $asset_path"
                        ((WARNING_COUNT++))
                    fi
                fi
            done
        done < "$file"
    done

    # 3. Check for duplicate data-order values
    if [[ -f "$ORDER_TRACKING_FILE" ]]; then
        # Get unique order values
        local unique_orders=$(cut -d: -f1 "$ORDER_TRACKING_FILE" | sort -u)
        for order in $unique_orders; do
            local count=$(grep -c "^$order:" "$ORDER_TRACKING_FILE" || echo "0")
            if [[ "$count" -gt 1 ]]; then
                validation_error "Duplicate data-order value \"$order\" found in:"
                grep "^$order:" "$ORDER_TRACKING_FILE" | while read -r entry; do
                    local dup_file="${entry#*:}"
                    validation_hint "$(basename "$dup_file")"
                done
                ((ERROR_COUNT++))
            fi
        done
    fi

    # Cleanup
    rm -f "$ORDER_TRACKING_FILE"

    # Summary
    echo ""
    if [[ $ERROR_COUNT -gt 0 || $WARNING_COUNT -gt 0 ]]; then
        if [[ $ERROR_COUNT -gt 0 ]]; then
            log_error "Validation failed: $ERROR_COUNT error(s), $WARNING_COUNT warning(s)"
        else
            log_warn "Validation passed with $WARNING_COUNT warning(s)"
        fi
    else
        log_info "Validation passed: all slides are valid"
    fi

    # Return error code if errors found
    if [[ $ERROR_COUNT -gt 0 ]]; then
        return 1
    fi
    return 0
}

# Get MIME type based on file extension
get_mime_type() {
    local file="$1"
    local ext="${file##*.}"
    ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

    case "$ext" in
        png)  echo "image/png" ;;
        jpg|jpeg)  echo "image/jpeg" ;;
        svg)  echo "image/svg+xml" ;;
        gif)  echo "image/gif" ;;
        *)    echo "" ;;
    esac
}

# Get file size in bytes (cross-platform)
get_file_size() {
    local file="$1"
    if [[ -f "$file" ]]; then
        # Use wc -c which works on both macOS and Linux
        wc -c < "$file" | tr -d ' '
    else
        echo "0"
    fi
}

# Process assets in HTML content
# - Inline small images as base64 data URLs
# - Copy large images to assets/ directory and update paths
process_assets() {
    local content="$1"
    local source_dir="$2"
    local output_dir="$3"
    local threshold="$4"

    # Create a temp file to work with
    local temp_file=$(mktemp)
    echo "$content" > "$temp_file"

    # Find all img src attributes
    # Pattern matches: src="path" or src='path'
    local img_srcs=$(grep -oE 'src=["'"'"'][^"'"'"']+["'"'"']' "$temp_file" | \
                     sed -E 's/src=["'"'"']([^"'"'"']+)["'"'"']/\1/' | \
                     grep -iE '\.(png|jpg|jpeg|svg|gif)$' || true)

    if [[ -z "$img_srcs" ]]; then
        cat "$temp_file"
        rm -f "$temp_file"
        return
    fi

    # Process each image source
    while IFS= read -r src; do
        [[ -z "$src" ]] && continue

        # Skip already processed data URLs
        if [[ "$src" == data:* ]]; then
            continue
        fi

        # Skip external URLs
        if [[ "$src" == http://* || "$src" == https://* ]]; then
            continue
        fi

        # Resolve the image path
        local img_path=""
        if [[ "$src" == /* ]]; then
            # Absolute path from project root
            img_path="$PRESENTATION_DIR$src"
        else
            # Relative path - try from source directory first, then presentation directory
            if [[ -f "$source_dir/$src" ]]; then
                img_path="$source_dir/$src"
            elif [[ -f "$PRESENTATION_DIR/$src" ]]; then
                img_path="$PRESENTATION_DIR/$src"
            fi
        fi

        # Skip if file not found
        if [[ ! -f "$img_path" ]]; then
            log_warn "Image not found: $src (tried $source_dir and $PRESENTATION_DIR)"
            continue
        fi

        # Get file size and MIME type
        local file_size=$(get_file_size "$img_path")
        local mime_type=$(get_mime_type "$img_path")

        if [[ -z "$mime_type" ]]; then
            log_warn "Unknown image type: $src"
            continue
        fi

        local new_src=""
        local filename=$(basename "$img_path")

        if [[ "$file_size" -lt "$threshold" ]]; then
            # Inline as base64 data URL
            local base64_data=$(base64 < "$img_path" | tr -d '\n')
            new_src="data:$mime_type;base64,$base64_data"
            log_info "  Inlined: $filename ($file_size bytes)"
        else
            # Copy to assets directory and update path
            local assets_dir="$output_dir/assets"
            mkdir -p "$assets_dir"

            # Handle potential filename collisions by adding hash if needed
            local dest_file="$assets_dir/$filename"
            if [[ -f "$dest_file" ]]; then
                # Check if it's the same file
                if ! cmp -s "$img_path" "$dest_file"; then
                    # Different file with same name, add hash prefix
                    local hash=$(md5sum "$img_path" 2>/dev/null | cut -c1-8 || md5 -q "$img_path" 2>/dev/null | cut -c1-8)
                    filename="${hash}_${filename}"
                    dest_file="$assets_dir/$filename"
                fi
            fi

            cp "$img_path" "$dest_file"
            new_src="assets/$filename"
            log_info "  Copied: $filename ($file_size bytes > $threshold threshold)"
        fi

        # Escape special characters for sed
        local escaped_src=$(echo "$src" | sed 's/[&/\]/\\&/g')
        local escaped_new_src=$(echo "$new_src" | sed 's/[&/\]/\\&/g')

        # Replace the src attribute in the temp file
        sed -i.bak "s|src=\"$escaped_src\"|src=\"$escaped_new_src\"|g" "$temp_file"
        sed -i.bak "s|src='$escaped_src'|src='$escaped_new_src'|g" "$temp_file"

    done <<< "$img_srcs"

    # Output the processed content
    cat "$temp_file"
    rm -f "$temp_file" "$temp_file.bak"
}

# JSON parsing helper - uses jq if available, falls back to Python
json_get() {
    local file="$1"
    local query="$2"
    local default="$3"

    if command -v jq &> /dev/null; then
        result=$(jq -r "$query // \"$default\"" "$file" 2>/dev/null)
    elif command -v python3 &> /dev/null; then
        result=$(python3 -c "
import json, sys
try:
    data = json.load(open('$file'))
    query = '$query'.strip('.')
    parts = query.split('.')
    val = data
    for part in parts:
        if part and part in val:
            val = val[part]
        else:
            val = '$default'
            break
    if isinstance(val, list):
        print(json.dumps(val))
    elif val is None:
        print('$default')
    else:
        print(val)
except:
    print('$default')
" 2>/dev/null)
    else
        result="$default"
    fi
    echo "$result"
}

# JSON array helper
json_array() {
    local file="$1"
    local query="$2"

    if command -v jq &> /dev/null; then
        jq -c "$query // []" "$file" 2>/dev/null
    elif command -v python3 &> /dev/null; then
        python3 -c "
import json
try:
    data = json.load(open('$file'))
    query = '$query'.strip('.')
    parts = query.split('.')
    val = data
    for part in parts:
        if part and part in val:
            val = val[part]
        else:
            val = []
            break
    print(json.dumps(val if isinstance(val, list) else []))
except:
    print('[]')
" 2>/dev/null
    else
        echo "[]"
    fi
}

# Check for jq or python3
check_dependencies() {
    if ! command -v jq &> /dev/null && ! command -v python3 &> /dev/null; then
        log_error "Either jq or python3 is required but neither is installed."
        log_info "Install jq with: brew install jq (macOS) or apt-get install jq (Linux)"
        exit 1
    fi
    if command -v jq &> /dev/null; then
        log_info "Using jq for JSON parsing"
    else
        log_info "Using Python for JSON parsing (jq not found)"
    fi
}

# Load configuration from JSON file
load_config() {
    if [[ -f "$CONFIG_FILE" ]]; then
        log_info "Loading configuration from $CONFIG_FILE"

        # Parse config values with defaults using helper functions
        TITLE=$(json_get "$CONFIG_FILE" ".title" "$DEFAULT_TITLE")
        DEFAULT_THEME_CONFIG=$(json_get "$CONFIG_FILE" ".defaultTheme" "$DEFAULT_THEME")
        DEFAULT_PROFILE=$(json_get "$CONFIG_FILE" ".defaultProfile" "")

        # Support both flat outputDir and nested output.dir formats
        OUTPUT_DIR=$(json_get "$CONFIG_FILE" ".output.dir" "")
        if [[ -z "$OUTPUT_DIR" ]]; then
            OUTPUT_DIR=$(json_get "$CONFIG_FILE" ".outputDir" "output")
        fi

        SECTIONS_JSON=$(json_array "$CONFIG_FILE" ".sections")

        # Asset inlining threshold
        INLINE_THRESHOLD=$(json_get "$CONFIG_FILE" ".assets.inlineThreshold" "")
        if [[ -z "$INLINE_THRESHOLD" ]]; then
            INLINE_THRESHOLD=$(json_get "$CONFIG_FILE" ".inlineThreshold" "$DEFAULT_INLINE_THRESHOLD")
        fi
    else
        log_warn "Config file not found at $CONFIG_FILE, using defaults"
        TITLE="$DEFAULT_TITLE"
        DEFAULT_THEME_CONFIG="$DEFAULT_THEME"
        DEFAULT_PROFILE=""
        OUTPUT_DIR="output"
        SECTIONS_JSON="$DEFAULT_SECTIONS"
        INLINE_THRESHOLD="$DEFAULT_INLINE_THRESHOLD"
    fi

    # Make output directory path absolute if relative (relative to presentation directory)
    if [[ "$OUTPUT_DIR" != /* ]]; then
        OUTPUT_DIR="$PRESENTATION_DIR/$OUTPUT_DIR"
    fi

    log_info "Title: $TITLE"
    log_info "Default Theme: $DEFAULT_THEME_CONFIG"
    if [[ -n "$DEFAULT_PROFILE" && "$DEFAULT_PROFILE" != "null" ]]; then
        log_info "Default Profile: $DEFAULT_PROFILE"
    fi
    log_info "Output Directory: $OUTPUT_DIR"
    log_info "Asset Inline Threshold: $INLINE_THRESHOLD bytes"
}

# Discover and sort slide files
discover_slides() {
    SLIDES_DIR="$PRESENTATION_DIR/slides"

    if [[ ! -d "$SLIDES_DIR" ]]; then
        log_error "Slides directory not found at $SLIDES_DIR"
        log_info "Create the slides/ directory and add .html slide files"
        exit 1
    fi

    # Find all slide files
    SLIDE_FILES=()
    while IFS= read -r -d '' file; do
        SLIDE_FILES+=("$file")
    done < <(find "$SLIDES_DIR" -maxdepth 1 -name '*.html' -print0 2>/dev/null)

    if [[ ${#SLIDE_FILES[@]} -eq 0 ]]; then
        log_error "No slide files found in $SLIDES_DIR"
        log_info "Add .html slide files to the slides/ directory"
        exit 1
    fi

    log_info "Found ${#SLIDE_FILES[@]} slide file(s)"

    # Extract data-order from each slide and create sortable array
    SLIDES_WITH_ORDER=()
    for file in "${SLIDE_FILES[@]}"; do
        # Extract data-order attribute value from the slide's root div (macOS compatible)
        local file_content=$(cat "$file")
        ORDER=$(extract_data_order "$file_content")

        if [[ -z "$ORDER" ]]; then
            log_warn "No data-order found in $(basename "$file"), using 9999"
            ORDER=9999
        fi

        SLIDES_WITH_ORDER+=("$ORDER:$file")
    done

    # Sort by order number
    IFS=$'\n' SORTED_SLIDES=($(printf '%s\n' "${SLIDES_WITH_ORDER[@]}" | sort -t: -k1 -n))
    unset IFS

    # Extract just the file paths in sorted order
    ORDERED_SLIDE_FILES=()
    for entry in "${SORTED_SLIDES[@]}"; do
        file="${entry#*:}"
        ORDERED_SLIDE_FILES+=("$file")
        log_info "  Slide $(basename "$file") (order: ${entry%%:*})"
    done
}

# Generate the combined HTML output
generate_html() {
    # Create output directory if it doesn't exist
    mkdir -p "$OUTPUT_DIR"

    OUTPUT_FILE="$OUTPUT_DIR/presentation.html"

    log_info "Generating $OUTPUT_FILE"

    # Read CSS content from lib/core/ (modular CSS files in load order)
    CORE_DIR="$LIB_DIR/core"
    if [[ ! -d "$CORE_DIR" ]]; then
        log_error "Core CSS directory not found at $CORE_DIR"
        exit 1
    fi
    # Ordered core CSS layers:
    #   Layer 1 - Foundation:  variables → base
    #   Layer 2 - Themes:     themes → theme-cisco → themes-light → theme-accents
    #   Layer 3 - Components: typography → cards → diagrams → data-display → terminal → quotes
    #   Layer 4 - UI Chrome:  navigation → ui-panels
    #   Layer 5 - Animations: animations
    CORE_FILES=(
        "variables.css"
        "base.css"
        "themes.css"
        "theme-cisco.css"
        "themes-light.css"
        "theme-accents.css"
        "typography.css"
        "cards.css"
        "diagrams.css"
        "data-display.css"
        "terminal.css"
        "quotes.css"
        "navigation.css"
        "ui-panels.css"
        "animations.css"
    )
    CSS_CONTENT=""
    for core_file in "${CORE_FILES[@]}"; do
        if [[ -f "$CORE_DIR/$core_file" ]]; then
            CSS_CONTENT+="
/* --- $core_file --- */
$(cat "$CORE_DIR/$core_file")
"
        else
            log_warn "Core CSS file missing: $core_file"
        fi
    done

    # Read ALL profile CSS files for runtime switching
    # Available profiles: tech, corporate, academic, creative
    PROFILE_CSS_CONTENT=""
    PROFILES_DIR="$LIB_DIR/profiles"
    if [[ -d "$PROFILES_DIR" ]]; then
        for profile_file in "$PROFILES_DIR"/*.css; do
            if [[ -f "$profile_file" ]]; then
                profile_name=$(basename "$profile_file" .css)
                # Skip base.css (documentation only)
                if [[ "$profile_name" == "base" ]]; then
                    continue
                fi
                PROFILE_CSS_CONTENT+="
/* Style Profile: $profile_name */
$(cat "$profile_file")
"
                log_info "Including profile CSS: $profile_name"
            fi
        done
    else
        log_warn "Profiles directory not found: $PROFILES_DIR"
    fi

    # Read Prism.js CSS (syntax highlighting theme)
    PRISM_CSS_FILE="$LIB_DIR/prism.css"
    if [[ -f "$PRISM_CSS_FILE" ]]; then
        PRISM_CSS_CONTENT=$(cat "$PRISM_CSS_FILE")
        log_info "Including Prism.js syntax highlighting CSS"
    else
        PRISM_CSS_CONTENT=""
        log_warn "lib/prism.css not found - syntax highlighting theme will be missing"
    fi

    # Read Math CSS (equation rendering styles)
    MATH_CSS_FILE="$LIB_DIR/math.css"
    if [[ -f "$MATH_CSS_FILE" ]]; then
        MATH_CSS_CONTENT=$(cat "$MATH_CSS_FILE")
        log_info "Including math equation CSS"
    else
        MATH_CSS_CONTENT=""
    fi

    # Read Extra Components CSS (charts, images, tabs, animated diagrams)
    EXTRA_CSS_FILE="$LIB_DIR/components-extra.css"
    if [[ -f "$EXTRA_CSS_FILE" ]]; then
        EXTRA_CSS_CONTENT=$(cat "$EXTRA_CSS_FILE")
        log_info "Including extra components CSS (charts, images, tabs, animations)"
    else
        EXTRA_CSS_CONTENT=""
    fi

    # Read Print CSS (print stylesheet for handouts)
    PRINT_CSS_FILE="$LIB_DIR/print.css"
    if [[ -f "$PRINT_CSS_FILE" ]]; then
        PRINT_CSS_CONTENT=$(cat "$PRINT_CSS_FILE")
        log_info "Including print stylesheet"
    else
        PRINT_CSS_CONTENT=""
    fi

    # Read JS content from lib/
    JS_FILE="$LIB_DIR/presentation.js"
    if [[ ! -f "$JS_FILE" ]]; then
        log_error "presentation.js not found at $JS_FILE"
        exit 1
    fi
    JS_CONTENT=$(cat "$JS_FILE")

    # Read Prism.js (syntax highlighting library)
    PRISM_JS_FILE="$LIB_DIR/prism.js"
    if [[ -f "$PRISM_JS_FILE" ]]; then
        PRISM_JS_CONTENT=$(cat "$PRISM_JS_FILE")
        log_info "Including Prism.js syntax highlighting library"
    else
        PRISM_JS_CONTENT=""
        log_warn "lib/prism.js not found - syntax highlighting will be disabled"
    fi

    # Read Extra Components JS (tabs, animated diagrams)
    EXTRA_JS_FILE="$LIB_DIR/components-extra.js"
    if [[ -f "$EXTRA_JS_FILE" ]]; then
        EXTRA_JS_CONTENT=$(cat "$EXTRA_JS_FILE")
        log_info "Including extra components JS (tabs, animations)"
    else
        EXTRA_JS_CONTENT=""
    fi

    # Read Lucide Icons JS from node_modules (installed via npm)
    LUCIDE_JS_FILE="$SCRIPT_DIR/node_modules/lucide/dist/umd/lucide.min.js"
    if [[ ! -f "$LUCIDE_JS_FILE" ]]; then
        log_info "Installing Lucide Icons (one-time setup)..."
        (cd "$SCRIPT_DIR" && npm install --ignore-scripts 2>&1 | tail -1)
    fi
    if [[ -f "$LUCIDE_JS_FILE" ]]; then
        LUCIDE_JS_CONTENT=$(cat "$LUCIDE_JS_FILE")
        log_info "Including Lucide Icons library (from node_modules)"
    else
        LUCIDE_JS_CONTENT=""
        log_warn "Lucide Icons not found - run 'npm install' in $(basename "$SCRIPT_DIR")/"
    fi

    # Read Math JS (accessibility & KaTeX integration)
    MATH_JS_FILE="$LIB_DIR/math.js"
    if [[ -f "$MATH_JS_FILE" ]]; then
        MATH_JS_CONTENT=$(cat "$MATH_JS_FILE")
        log_info "Including math equation JS"
    else
        MATH_JS_CONTENT=""
    fi

    # Start building HTML
    cat > "$OUTPUT_FILE" << 'HTMLHEAD'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
HTMLHEAD

    # Add title
    echo "    <title>$TITLE</title>" >> "$OUTPUT_FILE"

    # Add inlined CSS
    echo "    <style>" >> "$OUTPUT_FILE"
    echo "$CSS_CONTENT" >> "$OUTPUT_FILE"
    # Add profile CSS if available (all profiles for runtime switching)
    if [[ -n "$PROFILE_CSS_CONTENT" ]]; then
        echo "" >> "$OUTPUT_FILE"
        echo "/* Style Profiles - All included for runtime switching */" >> "$OUTPUT_FILE"
        echo "$PROFILE_CSS_CONTENT" >> "$OUTPUT_FILE"
    fi
    # Add Prism.js syntax highlighting CSS if available
    if [[ -n "$PRISM_CSS_CONTENT" ]]; then
        echo "" >> "$OUTPUT_FILE"
        echo "/* Prism.js Syntax Highlighting Theme */" >> "$OUTPUT_FILE"
        echo "$PRISM_CSS_CONTENT" >> "$OUTPUT_FILE"
    fi
    # Add Math equation CSS if available
    if [[ -n "$MATH_CSS_CONTENT" ]]; then
        echo "" >> "$OUTPUT_FILE"
        echo "/* Math Equation Styles */" >> "$OUTPUT_FILE"
        echo "$MATH_CSS_CONTENT" >> "$OUTPUT_FILE"
    fi
    # Add Extra Components CSS if available
    if [[ -n "$EXTRA_CSS_CONTENT" ]]; then
        echo "" >> "$OUTPUT_FILE"
        echo "/* Extra Components (Charts, Images, Tabs, Animations) */" >> "$OUTPUT_FILE"
        echo "$EXTRA_CSS_CONTENT" >> "$OUTPUT_FILE"
    fi
    # Discover and include custom CSS from presentation's styles/ directory
    CUSTOM_CSS_CONTENT=""
    CUSTOM_CSS_ARRAY=$(json_array "$CONFIG_FILE" ".customCSS" 2>/dev/null)
    if [[ -n "$CUSTOM_CSS_ARRAY" && "$CUSTOM_CSS_ARRAY" != "[]" && "$CUSTOM_CSS_ARRAY" != "null" ]]; then
        # Explicit customCSS array in config.json
        log_info "Loading custom CSS from config.json customCSS array"
        # Parse JSON array of file paths
        while IFS= read -r css_path; do
            css_path=$(echo "$css_path" | tr -d '"' | tr -d ' ')
            [[ -z "$css_path" || "$css_path" == "null" ]] && continue
            # Resolve relative to presentation directory
            if [[ "$css_path" != /* ]]; then
                css_path="$PRESENTATION_DIR/$css_path"
            fi
            if [[ -f "$css_path" ]]; then
                CUSTOM_CSS_CONTENT+="
/* Custom: $(basename "$css_path") */
$(cat "$css_path")
"
                log_info "  Including custom CSS: $(basename "$css_path")"
            else
                log_warn "  Custom CSS file not found: $css_path"
            fi
        done < <(echo "$CUSTOM_CSS_ARRAY" | tr -d '[]' | tr ',' '\n')
    elif [[ -d "$PRESENTATION_DIR/styles" ]]; then
        # Auto-discover styles/ directory
        log_info "Auto-discovering custom CSS from styles/"
        for custom_file in "$PRESENTATION_DIR/styles"/*.css; do
            if [[ -f "$custom_file" ]]; then
                CUSTOM_CSS_CONTENT+="
/* Custom: $(basename "$custom_file") */
$(cat "$custom_file")
"
                log_info "  Including custom CSS: $(basename "$custom_file")"
            fi
        done
    fi

    # Add custom CSS if found (after all framework CSS, before print)
    if [[ -n "$CUSTOM_CSS_CONTENT" ]]; then
        echo "" >> "$OUTPUT_FILE"
        echo "/* Custom Presentation Styles */" >> "$OUTPUT_FILE"
        echo "$CUSTOM_CSS_CONTENT" >> "$OUTPUT_FILE"
    fi

    # Add Print stylesheet if available (must be last CSS)
    if [[ -n "$PRINT_CSS_CONTENT" ]]; then
        echo "" >> "$OUTPUT_FILE"
        echo "/* Print Stylesheet */" >> "$OUTPUT_FILE"
        echo "$PRINT_CSS_CONTENT" >> "$OUTPUT_FILE"
    fi
    echo "    </style>" >> "$OUTPUT_FILE"

    # Build body class with theme and optional profile
    local BODY_CLASS="theme-$DEFAULT_THEME_CONFIG"
    if [[ -n "$DEFAULT_PROFILE" && "$DEFAULT_PROFILE" != "null" ]]; then
        BODY_CLASS="$BODY_CLASS profile-$DEFAULT_PROFILE"
    fi

    # Close head, start body with theme and profile classes
    cat >> "$OUTPUT_FILE" << HTMLBODY
</head>
<body class="$BODY_CLASS">
    <div class="progress-bar" id="progress"></div>
    <div class="section-indicator" id="sectionIndicator"></div>
    <div class="presentation" id="presentation">
HTMLBODY

    # Add slides (first slide gets "active" class)
    log_info "Processing assets..."
    FIRST_SLIDE=true
    for slide_file in "${ORDERED_SLIDE_FILES[@]}"; do
        SLIDE_CONTENT=$(cat "$slide_file")

        # Process assets in slide content (inline small images, copy large ones)
        SLIDE_DIR=$(dirname "$slide_file")
        SLIDE_CONTENT=$(process_assets "$SLIDE_CONTENT" "$SLIDE_DIR" "$OUTPUT_DIR" "$INLINE_THRESHOLD")

        if [[ "$FIRST_SLIDE" == true ]]; then
            # Add "active" class to first slide
            # Replace class="slide" with class="slide active"
            SLIDE_CONTENT=$(echo "$SLIDE_CONTENT" | sed 's/class="slide"/class="slide active"/')
            FIRST_SLIDE=false
        fi

        # Indent and add slide content
        echo "$SLIDE_CONTENT" | sed 's/^/        /' >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    done

    # Add navigation bar and close presentation div
    cat >> "$OUTPUT_FILE" << 'HTMLNAV'
    </div>
    <nav class="nav">
        <button class="nav-btn" id="prevBtn" onclick="Presentation.prevSlide()" title="Previous (Left Arrow)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        </button>
        <span class="slide-counter" id="slideCounter">1 / 1</span>
        <button class="nav-btn" id="nextBtn" onclick="Presentation.nextSlide()" title="Next (Right Arrow)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        </button>
    </nav>
HTMLNAV

    # Add Cisco footer with logo and copyright
    local BUILD_YEAR
    BUILD_YEAR=$(date +%Y)
    cat >> "$OUTPUT_FILE" << HTMLFOOTER
    <div class="slide-footer">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 216 114" fill="#049fd9">
            <path d="m 106.48,76.238 c -0.282,-0.077 -4.621,-1.196 -9.232,-1.196 -8.73,0 -13.986,4.714 -13.986,11.734 0,6.214 4.397,9.313 9.674,10.98 0.585,0.193 1.447,0.463 2.021,0.653 2.349,0.739 4.224,1.837 4.224,3.739 0,2.127 -2.167,3.504 -6.878,3.504 -4.14,0 -8.109,-1.184 -8.945,-1.395 v 8.637 c 0.466,0.099 5.183,1.025 10.222,1.025 7.248,0 15.539,-3.167 15.539,-12.595 0,-4.573 -2.8,-8.783 -8.947,-10.737 L 97.559,89.755 C 96,89.263 93.217,88.466 93.217,86.181 c 0,-1.805 2.062,-3.076 5.859,-3.076 3.276,0 7.263,1.101 7.404,1.145 z m 80.041,18.243 c 0,5.461 -4.183,9.879 -9.796,9.879 -5.619,0 -9.791,-4.418 -9.791,-9.879 0,-5.45 4.172,-9.87 9.791,-9.87 5.613,0 9.796,4.42 9.796,9.87 m -9.796,-19.427 c -11.544,0 -19.823,8.707 -19.823,19.427 0,10.737 8.279,19.438 19.823,19.438 11.543,0 19.834,-8.701 19.834,-19.438 0,-10.72 -8.291,-19.427 -19.834,-19.427 M 70.561,113.251 H 61.089 V 75.719 h 9.472"/>
            <path id="cisco-footer-path12" d="m 48.07,76.399 c -0.89,-0.264 -4.18,-1.345 -8.636,-1.345 -11.526,0 -19.987,8.218 -19.987,19.427 0,12.093 9.34,19.438 19.987,19.438 4.23,0 7.459,-1.002 8.636,-1.336 v -10.075 c -0.407,0.226 -3.503,1.992 -7.957,1.992 -6.31,0 -10.38,-4.441 -10.38,-10.019 0,-5.748 4.246,-10.011 10.38,-10.011 4.53,0 7.576,1.805 7.957,2.004"/>
            <use xlink:href="#cisco-footer-path12" transform="translate(98.86)"/>
            <g id="cisco-footer-g22">
                <path id="cisco-footer-path16" d="m 61.061,4.759 c 0,-2.587 -2.113,-4.685 -4.703,-4.685 -2.589,0 -4.702,2.098 -4.702,4.685 v 49.84 c 0,2.602 2.113,4.699 4.702,4.699 2.59,0 4.703,-2.097 4.703,-4.699 z M 35.232,22.451 c 0,-2.586 -2.112,-4.687 -4.702,-4.687 -2.59,0 -4.702,2.101 -4.702,4.687 v 22.785 c 0,2.601 2.112,4.699 4.702,4.699 2.59,0 4.702,-2.098 4.702,-4.699 z M 9.404,35.383 C 9.404,32.796 7.292,30.699 4.702,30.699 2.115,30.699 0,32.796 0,35.383 v 9.853 c 0,2.601 2.115,4.699 4.702,4.699 2.59,0 4.702,-2.098 4.702,-4.699"/>
                <use xlink:href="#cisco-footer-path16" transform="matrix(-1,0,0,1,112.717,0)"/>
            </g>
            <use xlink:href="#cisco-footer-g22" transform="matrix(-1,0,0,1,216,0)"/>
        </svg>
        <span>&copy; $BUILD_YEAR Cisco and/or its affiliates. All rights reserved. Cisco Confidential.</span>
    </div>
HTMLFOOTER

    # Add Lucide Icons library if available (before other scripts)
    if [[ -n "$LUCIDE_JS_CONTENT" ]]; then
        echo "    <script>" >> "$OUTPUT_FILE"
        echo "/* Lucide Icons Library */" >> "$OUTPUT_FILE"
        echo "$LUCIDE_JS_CONTENT" >> "$OUTPUT_FILE"
        echo "    </script>" >> "$OUTPUT_FILE"
    fi

    # Add Prism.js syntax highlighting library if available (before presentation.js)
    if [[ -n "$PRISM_JS_CONTENT" ]]; then
        echo "    <script>" >> "$OUTPUT_FILE"
        echo "/* Prism.js Syntax Highlighting Library */" >> "$OUTPUT_FILE"
        echo "$PRISM_JS_CONTENT" >> "$OUTPUT_FILE"
        echo "    </script>" >> "$OUTPUT_FILE"
    fi

    # Add Math JS if available (before presentation.js)
    if [[ -n "$MATH_JS_CONTENT" ]]; then
        echo "    <script>" >> "$OUTPUT_FILE"
        echo "/* Math Equation Accessibility & KaTeX Integration */" >> "$OUTPUT_FILE"
        echo "$MATH_JS_CONTENT" >> "$OUTPUT_FILE"
        echo "    </script>" >> "$OUTPUT_FILE"
    fi

    # Add inlined JavaScript
    echo "    <script>" >> "$OUTPUT_FILE"
    echo "$JS_CONTENT" >> "$OUTPUT_FILE"
    echo "    </script>" >> "$OUTPUT_FILE"

    # Add Extra Components JS if available (tabs, animated diagrams)
    if [[ -n "$EXTRA_JS_CONTENT" ]]; then
        echo "    <script>" >> "$OUTPUT_FILE"
        echo "/* Extra Components (Tabs, Animations) */" >> "$OUTPUT_FILE"
        echo "$EXTRA_JS_CONTENT" >> "$OUTPUT_FILE"
        echo "    </script>" >> "$OUTPUT_FILE"
    fi

    # Add initialization script with config
    # Includes Prism.highlightAll() call for syntax highlighting
    cat >> "$OUTPUT_FILE" << HTMLINIT
    <script>
    // Initialize presentation
    Presentation.init({
        sections: $SECTIONS_JSON,
        defaultTheme: '$DEFAULT_THEME_CONFIG'
    });

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
    </script>
</body>
</html>
HTMLINIT

    log_info "Build complete!"
    log_info "Output: $OUTPUT_FILE"

    # Calculate file size
    FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    SLIDE_COUNT=${#ORDERED_SLIDE_FILES[@]}
    log_info "Stats: $SLIDE_COUNT slides, $FILE_SIZE"
}

# Main execution
main() {
    echo ""
    echo "======================================"
    echo "  DeckCraft Build"
    echo "======================================"
    echo ""
    echo "Presentation: $(basename "$PRESENTATION_DIR")"
    echo ""

    check_dependencies
    load_config

    # Run validation before building (temporarily disable set -e to collect all errors)
    set +e
    validate_slides
    local validation_result=$?
    set -e

    if [[ $validation_result -ne 0 ]]; then
        echo ""
        echo "======================================"
        echo "  Build Failed - Fix validation errors"
        echo "======================================"
        echo ""
        exit 1
    fi

    echo ""
    discover_slides
    generate_html

    echo ""
    echo "======================================"
    echo "  Build Successful!"
    echo "======================================"
    echo ""
}

main
