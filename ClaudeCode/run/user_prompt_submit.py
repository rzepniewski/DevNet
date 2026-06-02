#!/usr/bin/env python3
"""
Claude Code User Prompt Submit Hook -> Splunk HEC
Captures prompt-level metrics for value proposition calculations
Lightweight and fast (3 second timeout)
"""

import json
import sys
import os
import subprocess
from datetime import datetime
from pathlib import Path

# Import shared Splunk utilities (installed alongside this hook)
sys.path.insert(0, str(Path(__file__).parent))
from splunk_common import (
    SPLUNK_INDEX,
    parse_otel_attributes,
    get_terminal,
    get_username,
    get_hostname,
    send_to_splunk,
)

SPLUNK_SOURCETYPE = "tools:ai:claude:prompt"

# State tracking for prompt counts per session
STATE_DIR = Path.home() / ".claude" / "logs" / "prompt_state"
STATE_DIR.mkdir(parents=True, exist_ok=True)


def get_git_branch(cwd):
    """Get current git branch if in repo"""
    try:
        result = subprocess.run(
            ["git", "branch", "--show-current"],
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=1
        )
        if result.returncode == 0:
            return result.stdout.strip() or "detached"
        return None
    except Exception:
        return None


def load_prompt_count(session_id):
    """Load prompt count for this session"""
    state_file = STATE_DIR / f"{session_id}_prompts.json"
    if state_file.exists():
        try:
            with open(state_file, 'r') as f:
                state = json.load(f)
                return state.get("prompt_count", 0)
        except Exception:
            pass
    return 0


def save_prompt_count(session_id, count):
    """Save prompt count for this session"""
    state_file = STATE_DIR / f"{session_id}_prompts.json"
    try:
        with open(state_file, 'w') as f:
            json.dump({"prompt_count": count, "last_updated": datetime.now().isoformat()}, f)
    except Exception:
        pass


def cleanup_old_prompt_files(max_age_days=7):
    """Remove prompt state files older than max_age_days."""
    try:
        cutoff = datetime.now().timestamp() - (max_age_days * 86400)
        for state_file in STATE_DIR.glob("*_prompts.json"):
            if state_file.stat().st_mtime < cutoff:
                state_file.unlink()
    except Exception:
        pass


def build_prompt_event(hook_data):
    """Build minimal prompt event for Splunk"""

    username = get_username()
    otel_attrs = parse_otel_attributes()

    # Extract prompt data
    prompt_text = hook_data.get("prompt", "")
    session_id = hook_data.get("session_id", "unknown")
    cwd = hook_data.get("cwd", "unknown")

    # Get current prompt count and increment
    prompt_count = load_prompt_count(session_id) + 1
    save_prompt_count(session_id, prompt_count)

    # Periodically cleanup old files
    if prompt_count == 1:
        cleanup_old_prompt_files()

    # Get git context
    git_branch = get_git_branch(cwd)

    # Build event
    event = {
        "event_type": "UserPromptSubmit",
        "session_id": session_id,
        "user": username,
        "manager": otel_attrs.get("manager", "unknown"),
        "organization": otel_attrs.get("organization", "unknown"),
        "cec": otel_attrs.get("cec", username),
        "terminal": get_terminal(),
        "prompt_count_in_session": prompt_count,
        "prompt_length_chars": len(prompt_text),
        "prompt_length_words": len(prompt_text.split()),
        "project_path": cwd,
        "timestamp": datetime.now().isoformat()
    }

    # Add git branch if available
    if git_branch:
        event["git_branch"] = git_branch

    return {
        "time": int(datetime.now().timestamp()),
        "host": get_hostname(),
        "source": "claude-code-cli",
        "sourcetype": SPLUNK_SOURCETYPE,
        "index": SPLUNK_INDEX,
        "event": event
    }


def main():
    """Main entry point"""
    log_file = Path.home() / ".claude" / "logs" / "prompt_debug.log"

    try:
        stdin_data = sys.stdin.read().strip()
        if not stdin_data:
            print("{}")
            sys.exit(0)

        hook_data = json.loads(stdin_data)

        # Build and send event
        event = build_prompt_event(hook_data)
        send_to_splunk(event, timeout_seconds=3)

        # Debug logging
        log_file.parent.mkdir(parents=True, exist_ok=True)
        with open(log_file, "a") as f:
            f.write(f"{datetime.now().isoformat()} - Prompt #{event['event']['prompt_count_in_session']} "
                   f"({event['event']['prompt_length_words']} words, {event['event']['prompt_length_chars']} chars)\n")

    except Exception as e:
        try:
            with open(log_file, "a") as f:
                f.write(f"{datetime.now().isoformat()} - Error: {str(e)}\n")
        except Exception:
            pass

    print("{}")
    sys.exit(0)


if __name__ == "__main__":
    main()
