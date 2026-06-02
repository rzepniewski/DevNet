#!/bin/bash
#
# Claude Code SVS Profile Setup Script
# Version: 3.0.0
# Description: Complete automated setup for Claude Code with SVS Bedrock account
#
# This script:
# - Auto-installs Claude Code CLI if not present
# - Auto-installs duo-sso via Homebrew if not present
# - Adds svs-devops-880 profile to duo-sso config
# - Configures Claude Code with 1M context Sonnet 4.6
# - Creates regional shortcuts (clod, clod1, clod2, clod3) calling claude directly
# - Authenticates via duo-sso
# - Verifies setup is working
#
# Usage: ./setup-claude-svs.sh [--yolo]
#   --yolo: Skip permission prompts (adds --dangerously-skip-permissions flag)
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Setup logging
mkdir -p "$HOME/.claude/logs"
SETUP_LOG="$HOME/.claude/logs/setup-claude-svs.log"
LOG_TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# Initialize log file
cat > "$SETUP_LOG" << 'LOG_HEADER'
╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║         CLAUDE CODE SVS SETUP - INSTALLATION LOG                     ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝

LOG_HEADER

echo "Setup started: $LOG_TIMESTAMP" >> "$SETUP_LOG"
echo "Script version: $SCRIPT_VERSION" >> "$SETUP_LOG"
echo "User: $(whoami)" >> "$SETUP_LOG"
echo "Hostname: $(hostname)" >> "$SETUP_LOG"
echo "" >> "$SETUP_LOG"

# Trap for cleanup and final logging
trap 'log_completion' EXIT

log_completion() {
    cat >> "$SETUP_LOG" << 'SUMMARY_HEADER'

╔═══════════════════════════════════════════════════════════════════════╗
║                                                                       ║
║                    SETUP COMPLETION SUMMARY                           ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝

SUMMARY_HEADER

    echo "Setup completed at: $(date '+%Y-%m-%d %H:%M:%S')" >> "$SETUP_LOG"
    echo "" >> "$SETUP_LOG"

    cat >> "$SETUP_LOG" << SUMMARY

📂 KEY FILE LOCATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  Claude Code Settings
   📁 $HOME/.claude/settings.json
   Contains: AWS profile, model config, hooks, statusline

2️⃣  duo-sso Configuration
   📁 $HOME/.config/duo-sso/config.json
   Contains: svs-devops-880 AWS profile settings

3️⃣  Telemetry Hook
   📁 $HOME/.claude/hooks/send_to_splunk_hec.py
   Tracks usage to Splunk for billing

4️⃣  Statusline Script
   📁 $HOME/.claude/statusline.sh
   Shows model, profile, tokens, git info

5️⃣  Regional Shortcuts
   📁 $HOME/.local/bin/clod    (us-east-2 default)
   📁 $HOME/.local/bin/clod1   (us-east-1)
   📁 $HOME/.local/bin/clod2   (us-east-2)
   📁 $HOME/.local/bin/clod3   (us-west-2)

🔧 MANUAL RECOVERY COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you need to manually recreate any configuration, use these commands:

# View Claude Code settings:
cat ~/.claude/settings.json

# Edit Claude Code settings:
vi ~/.claude/settings.json

# View duo-sso config:
cat ~/.config/duo-sso/config.json

# Re-authenticate with duo-sso:
duo-sso -profile svs-devops-880

# Check AWS profile:
echo \$AWS_PROFILE

# Verify AWS account:
export AWS_PROFILE=svs-devops-880
aws sts get-caller-identity

# Test shortcuts:
which clod clod1 clod2 clod3

════════════════════════════════════════════════════════════════════
SUMMARY

    echo "" >> "$SETUP_LOG"
    echo "Full log file: $(pwd)/$SETUP_LOG" >> "$SETUP_LOG"
    echo "════════════════════════════════════════════════════════════════════" >> "$SETUP_LOG"
    echo ""
    print_success "Installation log saved to: $(pwd)/$SETUP_LOG"
    echo ""
    print_info "This log contains full file contents and recovery commands"
}

# Helper function to log file modifications
log_file_change() {
    local file_path="$1"
    local description="$2"
    local content_snippet="${3:-}"

    cat >> "$SETUP_LOG" << LOG_ENTRY

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ FILE MODIFIED: $description
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📁 Location: $file_path
🕐 Timestamp: $(date '+%Y-%m-%d %H:%M:%S')

LOG_ENTRY

    if [[ -n "$content_snippet" ]]; then
        cat >> "$SETUP_LOG" << SNIPPET_LOG
📄 Content Snippet:
───────────────────────────────────────────────────────────────────────
$content_snippet
───────────────────────────────────────────────────────────────────────

SNIPPET_LOG
    fi

    if [[ -f "$file_path" ]]; then
        cat >> "$SETUP_LOG" << FULL_CONTENT
📋 Full File Content:
═══════════════════════════════════════════════════════════════════════
$(cat "$file_path")
═══════════════════════════════════════════════════════════════════════

FULL_CONTENT
    fi
}

# Configuration
SCRIPT_VERSION="3.0.0"
AWS_ACCOUNT_ID="200882728880"
AWS_ROLE="devops"
PROFILE_NAME="svs-devops-880"
SESSION_DURATION=28800
AWS_REGION="us-east-2"
YOLO_MODE=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --yolo)
            YOLO_MODE=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--yolo]"
            exit 1
            ;;
    esac
done

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Function to check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check OS
    if [[ "$(uname -s)" != "Darwin" ]]; then
        print_error "This script is designed for macOS only"
        exit 1
    fi
    print_success "macOS detected"

    # Check for Python 3
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is required but not installed"
        exit 1
    fi
    print_success "Python 3 found: $(python3 --version)"

    # Check for Homebrew (required for duo-sso)
    if ! command -v brew &> /dev/null; then
        print_error "Homebrew is not installed"
        print_info "Install from: https://brew.sh/"
        print_info "Run: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    print_success "Homebrew found"

    # Check for duo-sso (auto-install if missing)
    if ! command -v duo-sso &> /dev/null; then
        print_info "duo-sso not found, installing via Homebrew..."
        if brew install duo-sso; then
            print_success "duo-sso installed successfully"
        else
            print_error "Failed to install duo-sso"
            print_info "Manual installation: https://wwwin-github.cisco.com/ATS-operations/duo-sso"
            exit 1
        fi
    else
        print_success "duo-sso found"
    fi

    # Check for Claude Code (auto-install if missing)
    if ! command -v claude &> /dev/null; then
        print_info "Claude Code not found, installing..."
        if curl -fsSL https://claude.ai/install.sh | bash; then
            print_success "Claude Code installed successfully"
            # Reload PATH
            export PATH="$HOME/.local/bin:$PATH"
        else
            print_error "Failed to install Claude Code"
            print_info "Manual installation: https://docs.anthropic.com/en/docs/claude-code/setup"
            exit 1
        fi
    else
        print_success "Claude Code found: $(claude --version 2>/dev/null || echo 'installed')"

        # Note: Skipping automatic migration check to avoid hanging
        # Users can manually run 'claude migrate-installer' if they see warnings in /doctor
    fi

    # Check for Node.js/npm (required for statusline)
    if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
        print_info "Node.js/npm not found, installing via Homebrew..."
        if brew install node; then
            print_success "Node.js and npm installed successfully"
        else
            print_error "Failed to install Node.js/npm"
            print_info "Manual installation: brew install node"
            exit 1
        fi
    else
        print_success "Node.js/npm found: $(node --version) / $(npm --version)"
    fi

    # Check for AWS CLI (required for duo-sso authentication)
    if ! command -v aws &> /dev/null; then
        print_info "AWS CLI not found, installing via Homebrew..."
        if brew install awscli; then
            print_success "AWS CLI installed successfully"
        else
            print_error "Failed to install AWS CLI"
            print_info "Manual installation: brew install awscli"
            exit 1
        fi
    else
        print_success "AWS CLI found: $(aws --version)"
    fi

    echo ""
}

# Function to detect user email and CEC information
detect_user_info() {
    print_header "Detecting User Information"

    # Try to get email from git config
    local git_email
    git_email=$(git config --global user.email 2>/dev/null || echo "")

    if [[ -n "$git_email" && "$git_email" == *"@cisco.com" ]]; then
        USER_EMAIL="$git_email"
        # Extract CEC from email (part before @)
        USER_CEC="${git_email%@*}"
        print_success "Detected email from git: $USER_EMAIL"
        print_success "Detected CEC from email: $USER_CEC"
    else
        # Try to detect from existing duo-sso config
        if [[ -f "$HOME/.config/duo-sso/config.json" ]]; then
            local existing_email
            existing_email=$(python3 -c "import json; data=json.load(open('$HOME/.config/duo-sso/config.json')); print(data.get('email', ''))" 2>/dev/null || echo "")
            if [[ -n "$existing_email" ]]; then
                USER_EMAIL="$existing_email"
                USER_CEC="${existing_email%@*}"
                print_success "Detected email from duo-sso config: $USER_EMAIL"
                print_success "Detected CEC: $USER_CEC"
            fi
        fi

        # Fallback: prompt user
        if [[ -z "$USER_EMAIL" ]]; then
            print_warning "Could not detect email automatically"
            read -p "Enter your Cisco email address: " USER_EMAIL

            # Validate email format
            if [[ ! "$USER_EMAIL" =~ ^[a-zA-Z0-9._%+-]+@cisco\.com$ ]]; then
                print_error "Invalid email format. Must be a @cisco.com address"
                exit 1
            fi
            USER_CEC="${USER_EMAIL%@*}"
            print_success "Using email: $USER_EMAIL"
            print_success "Using CEC: $USER_CEC"
        fi
    fi

    # Check for existing manager CEC in settings
    if [[ -f "$HOME/.claude/settings.json" ]]; then
        MANAGER_CEC=$(python3 -c "
import json
try:
    with open('$HOME/.claude/settings.json', 'r') as f:
        data = json.load(f)
        otel_attrs = data.get('env', {}).get('OTEL_RESOURCE_ATTRIBUTES', '')
        for pair in otel_attrs.split(','):
            if '=' in pair:
                key, val = pair.split('=', 1)
                if key.strip() == 'manager':
                    print(val.strip())
                    break
except:
    pass
" 2>/dev/null || echo "")
    fi

    # Prompt for manager CEC if not found
    if [[ -z "$MANAGER_CEC" ]]; then
        print_warning "Manager CEC not found in existing configuration"
        read -p "Enter your manager's CEC (without @cisco.com): " MANAGER_CEC

        if [[ -z "$MANAGER_CEC" ]]; then
            print_error "Manager CEC is required for telemetry tracking"
            exit 1
        fi
        print_success "Using manager CEC: $MANAGER_CEC"
    else
        print_success "Found existing manager CEC: $MANAGER_CEC"
    fi

    echo ""
}

# Function to find duo-sso config path
find_duo_sso_config() {
    # Check new location first
    if [[ -f "$HOME/.config/duo-sso/config.json" ]]; then
        DUO_CONFIG="$HOME/.config/duo-sso/config.json"
    # Check legacy location
    elif [[ -f "$HOME/.duo-sso/config.json" ]]; then
        DUO_CONFIG="$HOME/.duo-sso/config.json"
        print_warning "Using legacy duo-sso config location"
    else
        # Config doesn't exist, create new one in preferred location
        DUO_CONFIG="$HOME/.config/duo-sso/config.json"
        mkdir -p "$(dirname "$DUO_CONFIG")"
        DUO_CONFIG_NEW=true
    fi
}

# Function to backup configuration files
backup_configs() {
    print_header "Backing Up Configuration Files"

    local backup_dir="$HOME/.claude/backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"

    # Backup duo-sso config if exists
    if [[ -f "$DUO_CONFIG" && -z "$DUO_CONFIG_NEW" ]]; then
        cp "$DUO_CONFIG" "$backup_dir/config.json"
        print_success "Backed up duo-sso config to: $backup_dir/config.json"
    fi

    # Backup Claude Code settings if exists
    if [[ -f "$HOME/.claude/settings.json" ]]; then
        cp "$HOME/.claude/settings.json" "$backup_dir/settings.json"
        print_success "Backed up Claude settings to: $backup_dir/settings.json"
    fi

    BACKUP_DIR="$backup_dir"
    echo ""
}

# Function to configure duo-sso
configure_duo_sso() {
    print_header "Configuring duo-sso Profile"

    if [[ -n "$DUO_CONFIG_NEW" ]]; then
        # Create new config from scratch
        print_info "Creating new duo-sso configuration..."

        python3 << EOF
import json
from pathlib import Path

config = {
    "partner_spid": "https://signin.aws.amazon.com/saml",
    "aws_urn": "https://signin.aws.amazon.com/saml",
    "session_duration_seconds": 43200,
    "preferred_factor": "push",
    "debug": False,
    "credentials_store": "pass",
    "email": "${USER_EMAIL}",
    "profiles": {
        "${PROFILE_NAME}": {
            "aws_account_id": "${AWS_ACCOUNT_ID}",
            "aws_role_name": "${AWS_ROLE}",
            "session_duration_seconds": ${SESSION_DURATION}
        }
    }
}

Path("${DUO_CONFIG}").write_text(json.dumps(config, indent=2))
print("✓ Created new duo-sso config with svs-devops-880 profile")
EOF

    else
        # Update existing config
        print_info "Adding svs-devops-880 profile to existing config..."

        python3 << EOF
import json
from pathlib import Path

config_path = Path("${DUO_CONFIG}")
data = json.loads(config_path.read_text())

# Update email if needed
if "email" not in data or not data["email"]:
    data["email"] = "${USER_EMAIL}"

# Add or update svs-devops-880 profile
if "profiles" not in data:
    data["profiles"] = {}

if "${PROFILE_NAME}" in data["profiles"]:
    print("ℹ Profile ${PROFILE_NAME} already exists, updating...")
else:
    print("+ Adding new profile: ${PROFILE_NAME}")

data["profiles"]["${PROFILE_NAME}"] = {
    "aws_account_id": "${AWS_ACCOUNT_ID}",
    "aws_role_name": "${AWS_ROLE}",
    "session_duration_seconds": ${SESSION_DURATION}
}

config_path.write_text(json.dumps(data, indent=2))
print("✓ duo-sso configuration updated")
EOF

    fi

    print_success "duo-sso profile configured: $DUO_CONFIG"
    log_file_change "$DUO_CONFIG" "duo-sso Configuration"
    echo ""
}

# Function to install Splunk telemetry hook
install_telemetry_hook() {
    print_header "Installing Splunk Telemetry Hook"

    local hooks_dir="$HOME/.claude/hooks"
    local hook_file="$hooks_dir/send_to_splunk_hec.py"

    # Create hooks directory
    mkdir -p "$hooks_dir"

    # Check if bundled telemetry script exists in package
    if [[ ! -f "$SCRIPT_DIR/send_to_splunk_hec.py" ]]; then
        print_error "send_to_splunk_hec.py not found in package"
        print_info "Expected location: $SCRIPT_DIR/send_to_splunk_hec.py"
        print_warning "Telemetry hook will not be installed"
        return 1
    fi

    # Copy shared Splunk module
    if [[ -f "$SCRIPT_DIR/splunk_common.py" ]]; then
        cp "$SCRIPT_DIR/splunk_common.py" "$hooks_dir/splunk_common.py"
        print_success "Shared Splunk module installed: $hooks_dir/splunk_common.py"
    else
        print_warning "splunk_common.py not found in package - hooks may not work"
    fi

    # Create default .env for HEC config (if not exists)
    local env_file="$hooks_dir/.env"
    if [[ ! -f "$env_file" ]]; then
        cat > "$env_file" << 'ENV_EOF'
# Splunk HEC Configuration for Claude Code hooks
# Edit these values to override defaults
SPLUNK_HEC_URL=https://svs-splunk-sink1.cisco.com:8088/services/collector/event
SPLUNK_HEC_TOKEN=58c81854-53ed-4e1c-9382-bcbfdcabf50d
ENV_EOF
        chmod 600 "$env_file"
        print_success "HEC env file created: $env_file"
    else
        print_info "HEC env file already exists: $env_file"
    fi

    # Copy telemetry script
    cp "$SCRIPT_DIR/send_to_splunk_hec.py" "$hook_file"
    chmod +x "$hook_file"
    print_success "Telemetry hook installed: $hook_file"
    log_file_change "$hook_file" "Splunk Telemetry Hook" "$(head -50 "$hook_file")"

    # Copy user prompt submit hook
    local prompt_hook_file="$hooks_dir/user_prompt_submit.py"
    if [[ -f "$SCRIPT_DIR/user_prompt_submit.py" ]]; then
        cp "$SCRIPT_DIR/user_prompt_submit.py" "$prompt_hook_file"
        chmod +x "$prompt_hook_file"
        print_success "Prompt tracking hook installed: $prompt_hook_file"
        log_file_change "$prompt_hook_file" "User Prompt Submit Hook" "$(head -50 "$prompt_hook_file")"
    else
        print_warning "user_prompt_submit.py not found in package - prompt tracking will be skipped"
    fi

    echo ""
}

# Function to configure Claude Code settings
configure_claude_settings() {
    print_header "Configuring Claude Code Settings"

    local settings_file="$HOME/.claude/settings.json"
    local settings_dir="$HOME/.claude"

    # Create .claude directory if it doesn't exist
    mkdir -p "$settings_dir"

    if [[ ! -f "$settings_file" ]]; then
        # Create new settings file from template
        print_info "Creating new Claude Code settings file..."

        if [[ -f "$SCRIPT_DIR/settings.json" ]]; then
            cp "$SCRIPT_DIR/settings.json" "$settings_file"
            sed -i.bak "s/MANAGER_CEC/${MANAGER_CEC}/g; s/YOUR_CEC/${USER_CEC}/g" "$settings_file"
            rm -f "${settings_file}.bak"
        else
            print_warning "settings.json template not found at $SCRIPT_DIR/settings.json"
            print_info "Creating minimal settings file..."
            cat > "$settings_file" << EOF
{
  "env": {
    "AWS_PROFILE": "${PROFILE_NAME}",
    "CLAUDE_CODE_USE_BEDROCK": "1",
    "OTEL_RESOURCE_ATTRIBUTES": "organization=Cisco,manager=${MANAGER_CEC},cec=${USER_CEC}"
  }
}
EOF
        fi

        # Add bypassPermissions for yolo mode
        if [[ "$YOLO_MODE" == "true" ]]; then
            python3 -c "
import json
with open('${settings_file}') as f:
    data = json.load(f)
if 'permissions' not in data:
    data['permissions'] = {}
data['permissions']['defaultMode'] = 'bypassPermissions'
with open('${settings_file}', 'w') as f:
    json.dump(data, f, indent=2)
print('✓ YOLO mode enabled: Permission prompts disabled')
"
        fi

        print_success "Created new Claude settings: $settings_file"
        log_file_change "$settings_file" "Claude Code Settings (NEW)" "$(head -30 "$settings_file")"

    else
        # Update existing settings
        print_info "Updating existing Claude settings..."

        python3 << EOF
import json
import re
from pathlib import Path

settings_path = Path("${settings_file}")
settings_content = settings_path.read_text()

# Try to parse JSON, fix common issues if it fails
try:
    data = json.loads(settings_content)
except json.JSONDecodeError as e:
    print(f"⚠ Warning: settings.json has JSON formatting issues: {e}", flush=True)
    print("Attempting to fix common JSON issues...", flush=True)

    # Try to fix trailing commas (common issue)
    fixed_content = re.sub(r',(\s*[}\]])', r'\1', settings_content)

    try:
        data = json.loads(fixed_content)
        print("✓ Fixed JSON formatting issues (removed trailing commas)", flush=True)
        # Backup original
        settings_path.rename(str(settings_path) + ".broken")
        print(f"✓ Backed up broken file to: {settings_path}.broken", flush=True)
    except json.JSONDecodeError:
        print("✗ Could not auto-fix settings.json", flush=True)
        print(f"Please fix the JSON errors manually or delete {settings_path}", flush=True)
        print(f"Error: {e}", flush=True)
        exit(1)

# Ensure env section exists
if "env" not in data:
    data["env"] = {}

# Get old profile for reporting
old_profile = data["env"].get("AWS_PROFILE", "none")

# Update AWS profile settings
data["env"]["AWS_PROFILE"] = "${PROFILE_NAME}"
data["env"]["AWS_REGION"] = "${AWS_REGION}"
data["env"]["CLAUDE_CODE_USE_BEDROCK"] = "1"

# Claude Code 2.x config — model set at root level, not in env
data["env"]["MAX_MCP_OUTPUT_TOKENS"] = "50000"
data["env"]["MAX_THINKING_TOKENS"] = "10240"
data["env"]["auth_mode"] = "duo-sso"
data["env"]["CLAUDE_CODE_MAX_OUTPUT_TOKENS"] = "64000"
data["env"]["SEMGREP_ALLOW_LOCAL_SCAN"] = "1"

# Add OTEL resource attributes for telemetry (used by custom hook)
data["env"]["OTEL_RESOURCE_ATTRIBUTES"] = "organization=Cisco,manager=${MANAGER_CEC},cec=${USER_CEC}"

# Disable OTEL SDK (we use custom hook instead)
data["env"]["OTEL_SDK_DISABLED"] = "true"

# Remove stale env keys from older setups
for key in ["ANTHROPIC_MODEL", "ANTHROPIC_CUSTOM_HEADERS", "MAX_THINKING_TOKENS_OLD",
            "OTEL_METRICS_EXPORTER", "OTEL_EXPORTER_OTLP_ENDPOINT",
            "OTEL_EXPORTER_OTLP_PROTOCOL", "OTEL_EXPORTER_OTLP_METRICS_ENDPOINT",
            "OTEL_EXPORTER_OTLP_LOGS_ENDPOINT", "OTEL_EXPORTER_OTLP_HEADERS"]:
    if key in data["env"]:
        del data["env"][key]

# Remove stale ANTHROPIC_CUSTOM_HEADERS (beta flags now GA in Claude Code 2.x)
if "ANTHROPIC_CUSTOM_HEADERS" in data["env"]:
    del data["env"]["ANTHROPIC_CUSTOM_HEADERS"]

# Add yolo mode settings if enabled
if "${YOLO_MODE}" == "true":
    if "permissions" not in data:
        data["permissions"] = {}
    data["permissions"]["defaultMode"] = "bypassPermissions"
    print("✓ YOLO mode enabled: Permission prompts disabled")

# Set model at root level (Claude Code 2.x standard)
data["model"] = "us.anthropic.claude-sonnet-4-6-v1[1m]"

# Remove deprecated root-level keys from older setups
for key in ["awsRegion", "useBedrock", "maxInputTokens"]:
    if key in data:
        del data[key]

# Enable project MCP servers
data["enableAllProjectMcpServers"] = True

# Modern defaults
data["includeCoAuthoredBy"] = data.get("includeCoAuthoredBy", False)
data["effortLevel"] = data.get("effortLevel", "high")
data["skipDangerousModePermissionPrompt"] = True

# Ensure deny-list exists (security: blocks destructive commands and secret file reads)
if "permissions" not in data:
    data["permissions"] = {}
if "deny" not in data["permissions"]:
    data["permissions"]["deny"] = [
        "Bash(rm :*)", "Bash(rm -rf :*)", "Bash(rm -r :*)",
        "Bash(:\\\\(\\\\){:|:&};:)", "Bash(dd :*)", "Bash(mkfs :*)", "Bash(printenv)",
        "Read(./.env)", "Read(./.env.*)", "Read(**/.env*)", "Read(**/env.php*)",
        "Read(./secrets/**)", "Read(**/secrets/**)", "Read(**/credentials/**)",
        "Read(**/.aws/**)", "Read(**/.ssh/**)",
        "Read(**/*.pem)", "Read(**/*.key)", "Read(**/*.p12)", "Read(**/*.pfx)"
    ]

# Add statusline configuration if not exists
if "statusLine" not in data:
    data["statusLine"] = {
        "type": "command",
        "command": "~/.claude/statusline.sh",
        "padding": 0
    }

# Set up hooks in new matcher-based format
if "hooks" not in data:
    data["hooks"] = {}

# Configure PostToolUse hook with new format
data["hooks"]["PostToolUse"] = [
    {
        "matcher": "*",
        "hooks": [
            {
                "type": "command",
                "command": "~/.claude/hooks/send_to_splunk_hec.py",
                "timeout": 5
            }
        ]
    }
]

# Configure SessionStart hook
data["hooks"]["SessionStart"] = [
    {
        "hooks": [
            {
                "type": "command",
                "command": "~/.claude/hooks/send_to_splunk_hec.py",
                "timeout": 5
            }
        ]
    }
]

# Configure SessionEnd hook
data["hooks"]["SessionEnd"] = [
    {
        "hooks": [
            {
                "type": "command",
                "command": "~/.claude/hooks/send_to_splunk_hec.py",
                "timeout": 10
            }
        ]
    }
]

# Configure UserPromptSubmit hook
data["hooks"]["UserPromptSubmit"] = [
    {
        "hooks": [
            {
                "type": "command",
                "command": "~/.claude/hooks/user_prompt_submit.py",
                "timeout": 3
            }
        ]
    }
]

settings_path.write_text(json.dumps(data, indent=2))

if old_profile != "${PROFILE_NAME}":
    print(f"✓ Changed AWS_PROFILE: {old_profile} → ${PROFILE_NAME}")
else:
    print(f"ℹ AWS_PROFILE already set to ${PROFILE_NAME}")
EOF

        print_success "Claude settings updated: $settings_file"
        log_file_change "$settings_file" "Claude Code Settings (UPDATED)"
    fi

    echo ""
}

# Function to create regional shortcuts
create_regional_shortcuts() {
    print_header "Creating Regional Shortcuts"

    local bin_dir="$HOME/.local/bin"
    mkdir -p "$bin_dir"

    # Determine if we should add --dangerously-skip-permissions flag
    local yolo_flag=""
    if [[ "$YOLO_MODE" == "true" ]]; then
        yolo_flag=" --dangerously-skip-permissions"
    fi

    # Check for existing clod installations (uv, pip, etc.) and warn
    local existing_clod
    existing_clod=$(which clod 2>/dev/null || echo "")
    if [[ -n "$existing_clod" && -L "$existing_clod" ]]; then
        local link_target
        link_target=$(readlink "$existing_clod" 2>/dev/null || echo "")
        if [[ "$link_target" == *"uv/tools"* || "$link_target" == *"pip"* ]]; then
            print_warning "Existing clod found as package install: $existing_clod → $link_target"
            print_warning "Setup will overwrite these symlinks with updated scripts"
        fi
    fi

    # Install shared core script
    local core_script="$HOME/.claude/clod-core.sh"
    if [[ -f "$SCRIPT_DIR/clod-core.sh" ]]; then
        cp "$SCRIPT_DIR/clod-core.sh" "$core_script"
        chmod +x "$core_script"

        # Inject yolo flag if enabled
        if [[ "$YOLO_MODE" == "true" ]]; then
            sed -i.bak "s|exec claude \"\\\$@\"|exec claude --dangerously-skip-permissions \"\\\$@\"|" "$core_script"
            rm -f "${core_script}.bak"
        fi

        print_success "Core launcher installed: $core_script"
    else
        print_error "clod-core.sh not found in package"
        return 1
    fi

    # Create thin wrapper scripts — each just sets region and calls core
    local -A regions=(
        ["clod"]="us-east-2"
        ["clod1"]="us-east-1"
        ["clod2"]="us-east-2"
        ["clod3"]="us-west-2"
    )

    local -A labels=(
        ["clod"]="us-east-2 (default)"
        ["clod1"]="us-east-1 (Virginia)"
        ["clod2"]="us-east-2 (Ohio)"
        ["clod3"]="us-west-2 (Oregon)"
    )

    for cmd in clod clod1 clod2 clod3; do
        cat > "$bin_dir/$cmd" << WRAPPER_EOF
#!/bin/bash
# SVS Claude Code shortcut — ${labels[$cmd]}
export CLOD_REGION="${regions[$cmd]}"
exec ~/.claude/clod-core.sh "\$@"
WRAPPER_EOF
        chmod +x "$bin_dir/$cmd"
        print_success "Created $cmd → ${labels[$cmd]}"
    done

    print_info "Regional shortcuts installed to: $bin_dir"

    # Log shortcuts
    for cmd in clod clod1 clod2 clod3; do
        log_file_change "$bin_dir/$cmd" "Regional Shortcut: $cmd (${regions[$cmd]})"
    done

    if [[ "$YOLO_MODE" == "true" ]]; then
        print_info "YOLO mode: All shortcuts will skip permission prompts"
    fi

    # Check if bin_dir is in PATH
    if [[ ":$PATH:" != *":$bin_dir:"* ]]; then
        print_warning "$bin_dir is not in your PATH"

        # Detect shell and RC file
        local shell_name=$(basename "$SHELL")
        local rc_file=""

        if [[ "$shell_name" == "zsh" ]]; then
            rc_file="$HOME/.zshrc"
        elif [[ "$shell_name" == "bash" ]]; then
            rc_file="$HOME/.bashrc"
        else
            print_warning "Unknown shell: $shell_name"
            print_info "Manually add to your shell RC file:"
            echo "    export PATH=\"\$HOME/.local/bin:\$PATH\""
            echo ""
            return
        fi

        # Create RC file if it doesn't exist
        if [[ ! -f "$rc_file" ]]; then
            print_info "Creating $rc_file..."
            touch "$rc_file"
            chmod 644 "$rc_file"
            print_success "Created $rc_file with 644 permissions"
        fi

        # Check if PATH export already exists in RC file
        if grep -q 'export PATH="$HOME/.local/bin:$PATH"' "$rc_file"; then
            print_info "PATH export already exists in $rc_file"
            print_info "Please restart your terminal or run: source $rc_file"
        else
            print_info "Adding PATH export to $rc_file..."
            echo '' >> "$rc_file"
            echo '# Added by Claude Code SVS setup script' >> "$rc_file"
            echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$rc_file"
            print_success "Added PATH export to $rc_file"
            print_info "Please restart your terminal or run: source $rc_file"
        fi
    fi

    echo ""
}

# Function to setup statusline
setup_statusline() {
    print_header "Setting Up Statusline"

    local statusline_file="$HOME/.claude/statusline.sh"

    # Check if statusline already exists
    if [[ -f "$statusline_file" ]]; then
        print_success "Statusline script already exists: $statusline_file"
        echo ""
        return 0
    fi

    # Install cc-statusline via npm (npm is now guaranteed to be available)
    print_info "Installing cc-statusline package..."
    if npm install -g @chongdashu/cc-statusline; then
        print_success "cc-statusline installed"

        # Generate statusline script
        if command -v cc-statusline &> /dev/null; then
            print_info "Generating statusline script..."
            cc-statusline > "$statusline_file"
            chmod +x "$statusline_file"
            print_success "Statusline script created: $statusline_file"
            print_info "Shows: Model, Profile, Tokens, Git Status, Session Info"
            log_file_change "$statusline_file" "Statusline Script (cc-statusline)" "$(head -50 "$statusline_file")"
        else
            print_warning "cc-statusline command not found after install"

            # Fallback to bundled statusline if available
            if [[ -f "$SCRIPT_DIR/statusline.sh" ]]; then
                print_info "Using bundled fallback statusline..."
                mkdir -p "$HOME/.claude"
                cp "$SCRIPT_DIR/statusline.sh" "$statusline_file"
                chmod +x "$statusline_file"
                print_success "Fallback statusline installed"
            fi
        fi
    else
        print_warning "Failed to install cc-statusline"

        # Fallback to bundled statusline if available
        if [[ -f "$SCRIPT_DIR/statusline.sh" ]]; then
            print_info "Using bundled fallback statusline..."
            mkdir -p "$HOME/.claude"
            cp "$SCRIPT_DIR/statusline.sh" "$statusline_file"
            chmod +x "$statusline_file"
            print_success "Fallback statusline installed"
        else
            print_warning "Statusline setup skipped"
        fi
    fi

    echo ""
}

# Function to authenticate with duo-sso
authenticate() {
    print_header "Authenticating to AWS"

    # Check if credentials already exist and are valid
    if command -v aws &> /dev/null; then
        export AWS_PROFILE="$PROFILE_NAME"
        if aws sts get-caller-identity &> /dev/null 2>&1; then
            print_success "AWS credentials already valid for $PROFILE_NAME"
            print_info "Skipping authentication (credentials still active)"
            echo ""
            return 0
        fi
    fi

    print_info "Running duo-sso authentication..."
    print_info "This will open your browser for Duo authentication"
    echo ""

    # Run duo-sso (without -chrome-persistent)
    if duo-sso -profile "$PROFILE_NAME"; then
        print_success "Authentication successful"
    else
        print_error "Authentication failed"
        print_info "You can re-run authentication later with:"
        print_info "  duo-sso -profile $PROFILE_NAME"
        return 1
    fi

    echo ""
}

# Function to verify setup
verify_setup() {
    print_header "Verifying Setup"

    # Check AWS credentials
    if command -v aws &> /dev/null; then
        export AWS_PROFILE="$PROFILE_NAME"

        print_info "Verifying AWS credentials..."
        if aws sts get-caller-identity &> /dev/null; then
            local account_id
            account_id=$(aws sts get-caller-identity --query Account --output text 2>/dev/null)

            if [[ "$account_id" == "$AWS_ACCOUNT_ID" ]]; then
                print_success "AWS credentials verified: Account $account_id ✓"
            else
                print_warning "Connected to account: $account_id (expected: $AWS_ACCOUNT_ID)"
            fi
        else
            print_warning "Could not verify AWS credentials"
            print_info "Try re-authenticating: duo-sso -profile $PROFILE_NAME -chrome-persistent"
        fi
    else
        print_warning "AWS CLI not installed - skipping credential verification"
    fi

    # Check Claude Code settings
    if [[ -f "$HOME/.claude/settings.json" ]]; then
        local current_profile
        current_profile=$(python3 -c "import json; print(json.load(open('$HOME/.claude/settings.json'))['env']['AWS_PROFILE'])" 2>/dev/null || echo "unknown")

        if [[ "$current_profile" == "$PROFILE_NAME" ]]; then
            print_success "Claude Code configured for profile: $PROFILE_NAME ✓"
        else
            print_warning "Claude Code profile is: $current_profile (expected: $PROFILE_NAME)"
        fi
    fi

    echo ""
}

# Function to print summary
print_summary() {
    print_header "Setup Complete! 🎉"

    echo -e "${GREEN}Your Claude Code is now configured to use the SVS Bedrock account.${NC}"
    echo ""

    echo -e "${BLUE}Configuration Summary:${NC}"
    echo "  • AWS Account: $AWS_ACCOUNT_ID (svs-devops-880)"
    echo "  • AWS Region: $AWS_REGION"
    echo "  • Profile: $PROFILE_NAME"
    echo "  • Session Duration: $(($SESSION_DURATION / 3600)) hours"
    echo "  • Model: Claude Sonnet 4.6 with 1M context"
    echo "  • User CEC: $USER_CEC"
    echo "  • Manager CEC: $MANAGER_CEC"
    if [[ "$YOLO_MODE" == "true" ]]; then
        echo "  • Mode: YOLO (permission prompts disabled)"
    fi
    echo ""

    echo -e "${BLUE}✓ All Files Installed to Standard Locations:${NC}"
    echo "  📁 $HOME/.claude/settings.json           (Claude Code config)"
    echo "  📁 $HOME/.claude/statusline.sh           (Status display)"
    echo "  📁 $HOME/.claude/hooks/                  (Telemetry hooks)"
    echo "  📁 $HOME/.config/duo-sso/config.json     (AWS auth)"
    echo "  📁 $HOME/.local/bin/clod*                (Launch shortcuts)"
    if [[ -n "$BACKUP_DIR" ]]; then
        echo "  📁 $BACKUP_DIR                           (Backups)"
    fi
    echo ""

    echo -e "${BLUE}Next Steps:${NC}"
    echo "  1. Launch Claude Code:"
    echo -e "     ${GREEN}clod${NC}                    # Default (us-east-2)"
    echo ""
    echo "     Or use regional shortcuts for better latency:"
    echo -e "     ${GREEN}clod1${NC}                   # us-east-1 (Virginia/East Coast)"
    echo -e "     ${GREEN}clod2${NC}                   # us-east-2 (Ohio/Central)"
    echo -e "     ${GREEN}clod3${NC}                   # us-west-2 (Oregon/West Coast)"
    echo ""
    if [[ "$YOLO_MODE" == "true" ]]; then
        echo -e "     ${YELLOW}Note: YOLO mode enabled - no permission prompts${NC}"
        echo ""
    fi
    echo "  2. Authentication expires? Just run the command again:"
    echo -e "     ${GREEN}clod, clod1, clod2, or clod3${NC} will auto-authenticate"
    echo ""
    echo "     Or manually re-authenticate:"
    echo -e "     ${GREEN}duo-sso -profile $PROFILE_NAME${NC}"
    echo ""
    echo "  3. To verify your account:"
    echo -e "     ${GREEN}export AWS_PROFILE=$PROFILE_NAME${NC}"
    echo -e "     ${GREEN}aws sts get-caller-identity${NC}"
    echo ""
}

# Main execution
main() {
    clear
    echo ""
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                                           ║${NC}"
    echo -e "${BLUE}║      Claude Code SVS Profile Setup Script v${SCRIPT_VERSION}      ║${NC}"
    echo -e "${BLUE}║                                                           ║${NC}"
    echo -e "${BLUE}║ This script will configure Claude Code to use the SVS    ║${NC}"
    echo -e "${BLUE}║ Bedrock account for better cost tracking and resource    ║${NC}"
    echo -e "${BLUE}║ allocation.                                               ║${NC}"
    echo -e "${BLUE}║                                                           ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""

    # Get script directory for finding bundled files
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

    # Run setup steps
    check_prerequisites
    detect_user_info
    find_duo_sso_config
    backup_configs
    configure_duo_sso
    install_telemetry_hook
    configure_claude_settings
    create_regional_shortcuts
    setup_statusline

    # Ask before authenticating
    echo ""
    read -p "Authenticate now with duo-sso? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        authenticate
    else
        print_info "Skipping authentication. You can authenticate later with:"
        print_info "  duo-sso -profile $PROFILE_NAME -chrome-persistent"
        echo ""
    fi

    verify_setup
    print_summary
}

# Run main function
main "$@"
