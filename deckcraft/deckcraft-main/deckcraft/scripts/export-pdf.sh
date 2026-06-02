#!/bin/bash
#
# export-pdf.sh - Export DeckCraft presentation to PDF
#
# Usage: ./export-pdf.sh <presentation.html> [options]
#
# This script wraps the Node.js PDF export tool, handling dependency
# installation and providing a simple CLI interface.
#
# Options are passed through to the underlying export-pdf.js script:
#   --output, -o    Output PDF path
#   --width         Viewport width (default: 1920)
#   --height        Viewport height (default: 1080)
#   --page-numbers  Add page numbers to PDF
#   --theme         Override theme
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXPORT_SCRIPT="$SCRIPT_DIR/export-pdf.js"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_error() {
    echo -e "${RED}Error:${NC} $1" >&2
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}Warning:${NC} $1"
}

# Show help
show_help() {
    cat << 'EOF'
DeckCraft PDF Export

Usage: ./export-pdf.sh <presentation.html> [options]

Exports a DeckCraft presentation to PDF format using headless Chrome.
Each slide is captured at full resolution and combined into a single PDF.

Options:
  --output, -o <path>   Output PDF path (default: same directory as input)
  --width <pixels>      Viewport width (default: 1920 for Full HD)
  --height <pixels>     Viewport height (default: 1080 for Full HD)
  --page-numbers        Add page numbers to each slide
  --theme <name>        Override theme (mesh|purple|cyan|emerald|orange|rose|blue|dark|light|warm|cool)
  --help, -h            Show this help message

Examples:
  ./export-pdf.sh presentation/my-deck.html
  ./export-pdf.sh presentation/my-deck.html -o ~/Desktop/export.pdf
  ./export-pdf.sh presentation/my-deck.html --theme dark --page-numbers
  ./export-pdf.sh presentation/my-deck.html --width 2560 --height 1440

Requirements:
  - Node.js (v14 or later)
  - npm (for dependency installation)

The script will automatically install required dependencies (puppeteer, pdf-lib)
on first run.
EOF
}

# Check if help is requested
if [[ "$1" == "--help" ]] || [[ "$1" == "-h" ]] || [[ -z "$1" ]]; then
    show_help
    exit 0
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | tr -d 'v')
if [[ "$NODE_VERSION" -lt 14 ]]; then
    print_error "Node.js v14 or later is required (found v$NODE_VERSION)"
    exit 1
fi

# Check if export script exists
if [[ ! -f "$EXPORT_SCRIPT" ]]; then
    print_error "Export script not found: $EXPORT_SCRIPT"
    exit 1
fi

# Check if input file exists
INPUT_FILE="$1"
if [[ ! -f "$INPUT_FILE" ]]; then
    print_error "Input file not found: $INPUT_FILE"
    exit 1
fi

# Install dependencies if needed
check_and_install_deps() {
    local DEPS_INSTALLED=true

    # Check for puppeteer
    if ! node -e "require('puppeteer')" 2>/dev/null; then
        DEPS_INSTALLED=false
    fi

    # Check for pdf-lib
    if ! node -e "require('pdf-lib')" 2>/dev/null; then
        DEPS_INSTALLED=false
    fi

    if [[ "$DEPS_INSTALLED" == "false" ]]; then
        echo "Installing required dependencies..."

        # Check if package.json exists, create minimal one if not
        if [[ ! -f "$SCRIPT_DIR/package.json" ]]; then
            cat > "$SCRIPT_DIR/package.json" << 'PACKAGE_EOF'
{
  "name": "deckcraft",
  "version": "1.0.0",
  "private": true,
  "description": "Offline presentation framework",
  "scripts": {
    "export-pdf": "node scripts/export-pdf.js"
  }
}
PACKAGE_EOF
        fi

        # Install dependencies
        cd "$SCRIPT_DIR"
        npm install puppeteer pdf-lib --save 2>&1 | while read -r line; do
            # Filter npm output to show progress
            if [[ "$line" == *"added"* ]] || [[ "$line" == *"packages"* ]]; then
                echo "  $line"
            fi
        done

        if [[ $? -ne 0 ]]; then
            print_error "Failed to install dependencies"
            exit 1
        fi

        print_success "Dependencies installed successfully"
        echo ""
    fi
}

# Install dependencies
check_and_install_deps

# Run the export script
echo "Starting PDF export..."
echo ""

node "$EXPORT_SCRIPT" "$@"
EXIT_CODE=$?

if [[ $EXIT_CODE -eq 0 ]]; then
    echo ""
    print_success "Export complete!"
else
    print_error "Export failed with exit code $EXIT_CODE"
fi

exit $EXIT_CODE
