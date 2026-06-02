#!/bin/bash
# SVS Claude Code launcher — shared pre-flight logic
# Called by clod, clod1, clod2, clod3 wrappers (or directly)
#
# Region is determined by:
#   1. CLOD_REGION env var (set by wrapper scripts)
#   2. Command name: clod1→us-east-1, clod2→us-east-2, clod3→us-west-2
#   3. Default: us-east-2

set -euo pipefail

# --- Region mapping from command name ---
CMD_NAME="$(basename "$0")"
case "${CLOD_REGION:-$CMD_NAME}" in
    clod1|us-east-1)   REGION="us-east-1" ;;
    clod3|us-west-2)   REGION="us-west-2" ;;
    clod4|eu-west-1)   REGION="eu-west-1" ;;
    clod5|eu-west-2)   REGION="eu-west-2" ;;
    clod6|ap-northeast-1) REGION="ap-northeast-1" ;;
    *)                  REGION="us-east-2" ;;  # clod, clod2, default
esac

# --- Profile detection ---
PROFILE="svs-devops-880"
if [[ -f ~/.claude/settings.json ]]; then
    SETTINGS_PROFILE=$(python3 -c "
import json
try:
    with open('$HOME/.claude/settings.json') as f:
        d = json.load(f)
        if 'env' in d and 'AWS_PROFILE' in d['env']:
            print(d['env']['AWS_PROFILE'])
        elif 'awsProfile' in d:
            print(d['awsProfile'])
except:
    pass
" 2>/dev/null || echo "")
    if [[ -n "$SETTINGS_PROFILE" ]]; then
        PROFILE="$SETTINGS_PROFILE"
    fi
fi

echo "→ Launching Claude Code with $PROFILE + $REGION..."

# --- Pre-flight checks ---
echo -n "→ Running pre-flight checks... "

# Check Splunk telemetry
echo -n "→ Checking Splunk telemetry... "
if grep -q "send_to_splunk_hec.py" ~/.claude/settings.json 2>/dev/null; then
    echo "→ Telemetry enabled"
else
    echo "⚠ Warning - Telemetry not configured"
fi

# Check duo-sso
echo -n "Installing duo-sso... "
if command -v duo-sso &>/dev/null; then
    echo "→ Installed"
else
    echo "→ Not installed"
    echo ""
    echo "Please install duo-sso first:"
    echo "  brew tap ats-operations/homebrew-tap https://wwwin-github.cisco.com/ATS-operations/homebrew-tap"
    echo "  brew install ats-operations/tap/duo-sso"
    exit 1
fi

# Check AWS credentials
echo -n "Checking AWS MFA/SSO... "
USER_EMAIL=$(aws sts get-caller-identity --profile "$PROFILE" --query 'Arn' --output text 2>/dev/null \
    | grep -oE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' | head -1)
if [[ $? -eq 0 && -n "$USER_EMAIL" ]]; then
    echo "→ Authenticated as $USER_EMAIL"
else
    echo "→ Authentication expired or not found"
    echo "→ Re-authenticating with duo-sso..."
    echo ""

    if duo-sso -profile "$PROFILE"; then
        echo ""
        echo -n "→ Verifying new credentials... "
        USER_EMAIL=$(aws sts get-caller-identity --profile "$PROFILE" --query 'Arn' --output text 2>/dev/null \
            | grep -oE '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' | head -1)
        if [[ $? -eq 0 && -n "$USER_EMAIL" ]]; then
            echo "→ Authenticated as $USER_EMAIL"
        else
            echo "→ Authentication verification failed"
            exit 1
        fi
    else
        echo "→ Authentication failed"
        echo "Please try manually: duo-sso -profile $PROFILE"
        exit 1
    fi
fi

echo "→ All checks passed! Launching Claude Code..."
echo "  Profile: $PROFILE"
echo "  Region: $REGION"
echo ""

export AWS_PROFILE="$PROFILE"
export AWS_REGION="$REGION"
export CLAUDE_CODE_USE_BEDROCK="1"
exec claude "$@"
