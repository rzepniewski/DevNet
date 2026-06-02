Claude Code SVS Setup Package (macOS) - AMER (Americas)
Generated: 2026-04-12 14:16:27 UTC
Region: AMER (Americas)
AWS Profile: svs-devops-880

This package contains version-controlled scripts from the SVS Service Portal repository:
1. setup-claude-svs.sh - Automated setup script (v3.0.0) for AMER (Americas)
2. send_to_splunk_hec.py - Splunk telemetry hook (PostToolUse, SessionStart, SessionEnd)
3. user_prompt_submit.py - Prompt tracking hook (UserPromptSubmit) for value metrics
4. splunk_common.py - Shared Splunk HEC utilities (used by hooks)
5. clod-core.sh - Shared launcher with pre-flight checks
6. statusline.sh - Simple statusline (no npm required)

Installation Instructions:
1. Extract this zip file
2. Run: chmod +x setup-claude-svs.sh
3. Run: ./setup-claude-svs.sh --yolo

The setup script will automatically:
- Install Claude Code CLI if not present
- Install duo-sso via Homebrew if needed
- Configure AWS profile for SVS Bedrock account (svs-devops-880)
- Set up Claude Sonnet 4.6 with 1M context window
- Create regional shortcuts (clod, clod1, clod2, clod3)
- Authenticate via duo-sso
- Skip permission prompts (--yolo mode)

Usage:
  clod        # Default (us-east-2)
  clod1       # us-east-1 (East Coast)
  clod2       # us-east-2 (Central)
  clod3       # us-west-2 (West Coast)

For support: https://svs-service-portal.cisco.com
