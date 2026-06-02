#!/bin/bash
# Simple Claude Code Statusline (No npm required)
# Shows essential info: Model, AWS Profile, Context Usage

input=$(cat)

# Parse all fields in a single python3 invocation
eval "$(echo "$input" | python3 -c "
import sys, json, os, shlex
try:
    data = json.load(sys.stdin)
except:
    data = {}

# Model
model = data.get('model', {})
if isinstance(model, dict):
    m = model.get('display_name', 'unknown')
else:
    m = model if model else 'unknown'
# Shorten model name
m = m.replace('global.anthropic.', '').replace('us.anthropic.', '')

# Profile
prof = None
if isinstance(data.get('env'), dict):
    prof = data['env'].get('AWS_PROFILE')
if not prof and 'awsProfile' in data:
    prof = data['awsProfile']
if not prof:
    prof = os.environ.get('AWS_PROFILE', 'default')

# Tokens
used = data.get('totalInputTokens', 0)
maxt = data.get('maxInputTokens', 1000000)

print(f'model_short={shlex.quote(m)}')
print(f'profile={shlex.quote(prof)}')
print(f'tokens_used={used}')
print(f'tokens_max={maxt}')
" 2>/dev/null)" || {
    model_short="unknown"
    profile="${AWS_PROFILE:-default}"
    tokens_used=0
    tokens_max=1000000
}

# Get git branch if in a repo
git_branch=""
if git rev-parse --git-dir > /dev/null 2>&1; then
    git_branch=$(git branch --show-current 2>/dev/null || echo "")
fi

# Calculate percentage
if [[ "$tokens_max" -gt 0 ]]; then
    pct=$(( tokens_used * 100 / tokens_max ))
else
    pct=0
fi

# Build statusline
output=""

# Line 1: Model and Profile
output+="$model_short | $profile"
if [[ -n "$git_branch" ]]; then
    output+=" | $git_branch"
fi
output+="\n"

# Line 2: Context usage
output+="Context: ${tokens_used}/${tokens_max} tokens (${pct}%)"

echo -e "$output"
