#!/usr/bin/env python3
"""
Claude Code Usage Statistics -> Splunk HEC (Streamlined)
Only sends fields used in dashboard: user, tokens, cost, tools, git changes
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

SPLUNK_SOURCETYPE = "tools:ai:claude"

# Claude API Pricing (per 1M tokens) - List prices from AWS Bedrock
PRICING = {
    "claude-opus-4-6": {"input": 15.00, "output": 75.00, "cache_write": 18.75, "cache_read": 1.50},
    "claude-sonnet-4-6": {"input": 3.00, "output": 15.00, "cache_write": 3.75, "cache_read": 0.30},
    "claude-sonnet-4-5": {"input": 3.00, "output": 15.00, "cache_write": 3.75, "cache_read": 0.30},
    "claude-sonnet-3-5": {"input": 3.00, "output": 15.00, "cache_write": 3.75, "cache_read": 0.30},
    "claude-opus-3": {"input": 15.00, "output": 75.00, "cache_write": 18.75, "cache_read": 1.50},
    "claude-haiku-4-5": {"input": 0.80, "output": 4.00, "cache_write": 1.00, "cache_read": 0.08},
    "claude-haiku-3-5": {"input": 0.80, "output": 4.00, "cache_write": 1.00, "cache_read": 0.08},
}

# Cisco enterprise discount multiplier (applied to list prices)
# This represents Cisco's negotiated AWS Bedrock discount (~99.06% off list price)
# Example: $329.63 list price -> $3.09 actual cost = 0.00938 multiplier
# Update this value if the enterprise discount rate changes
CISCO_DISCOUNT_MULTIPLIER = 0.00938

# State tracking
STATE_DIR = Path.home() / ".claude" / "logs" / "session_state"
STATE_DIR.mkdir(parents=True, exist_ok=True)


def load_session_state(session_id):
    """Load previous state"""
    state_file = STATE_DIR / f"{session_id}.json"
    if state_file.exists():
        try:
            with open(state_file, 'r') as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "total_tokens": {"input": 0, "output": 0, "cache_read": 0, "cache_write": 0},
        "list_cost_usd": 0.0,
        "cisco_cost_usd": 0.0,
        "start_time": None
    }


def save_session_state(session_id, metrics, start_time=None):
    """Save current state"""
    state_file = STATE_DIR / f"{session_id}.json"
    try:
        state = {
            "total_tokens": metrics["total_tokens"],
            "list_cost_usd": metrics["list_cost_usd"],
            "cisco_cost_usd": metrics["cisco_cost_usd"]
        }
        if start_time is not None:
            state["start_time"] = start_time
        with open(state_file, 'w') as f:
            json.dump(state, f)
    except Exception:
        pass


def extract_model_name(model_string):
    """Extract model name from full model ID string."""
    if not model_string:
        return "unknown"
    model_lower = model_string.lower()
    # Check 4.6 family first (newest)
    if "opus-4-6" in model_lower or "opus-4.6" in model_lower:
        return "claude-opus-4-6"
    if "sonnet-4-6" in model_lower or "sonnet-4.6" in model_lower:
        return "claude-sonnet-4-6"
    # 4.5 family
    if "sonnet-4-5" in model_lower or "sonnet-4.5" in model_lower or "sonnet-4" in model_lower:
        return "claude-sonnet-4-5"
    if "haiku-4-5" in model_lower or "haiku-4.5" in model_lower or "haiku-4" in model_lower:
        return "claude-haiku-4-5"
    # 3.x family
    if "sonnet-3" in model_lower:
        return "claude-sonnet-3-5"
    if "opus-3" in model_lower or "opus" in model_lower:
        return "claude-opus-3"
    if "haiku-3" in model_lower or "haiku" in model_lower:
        return "claude-haiku-3-5"
    return model_string


def calculate_cost(token_data, model_name):
    """Calculate list price cost from all token types (before Cisco discount)"""
    if model_name not in PRICING:
        return 0.0

    pricing = PRICING[model_name]
    cost = 0.0
    cost += (token_data.get("input_tokens", 0) / 1_000_000) * pricing["input"]
    cost += (token_data.get("output_tokens", 0) / 1_000_000) * pricing["output"]
    cost += (token_data.get("cache_creation_input_tokens", 0) / 1_000_000) * pricing["cache_write"]
    cost += (token_data.get("cache_read_input_tokens", 0) / 1_000_000) * pricing["cache_read"]
    return round(cost, 6)


def parse_transcript(transcript_path, session_id):
    """Parse transcript for token usage"""
    metrics = {
        "total_tokens": {"input": 0, "output": 0, "cache_read": 0, "cache_write": 0},
        "model": "unknown",
        "list_cost_usd": 0.0,
        "cisco_cost_usd": 0.0
    }

    if not transcript_path or not Path(transcript_path).exists():
        return metrics

    try:
        with open(transcript_path, 'r') as f:
            for line in f:
                if not line.strip():
                    continue
                try:
                    event = json.loads(line)
                    if event.get("sessionId") != session_id:
                        continue

                    if event.get("type") == "assistant":
                        message = event.get("message", {})
                        if "model" in message:
                            metrics["model"] = extract_model_name(message["model"])

                        usage = message.get("usage", {})
                        if usage:
                            metrics["total_tokens"]["input"] += usage.get("input_tokens", 0)
                            metrics["total_tokens"]["output"] += usage.get("output_tokens", 0)
                            metrics["total_tokens"]["cache_read"] += usage.get("cache_read_input_tokens", 0)
                            metrics["total_tokens"]["cache_write"] += usage.get("cache_creation_input_tokens", 0)
                except Exception:
                    continue

        # Calculate list price cost
        list_cost = calculate_cost({
            "input_tokens": metrics["total_tokens"]["input"],
            "output_tokens": metrics["total_tokens"]["output"],
            "cache_creation_input_tokens": metrics["total_tokens"]["cache_write"],
            "cache_read_input_tokens": metrics["total_tokens"]["cache_read"]
        }, metrics["model"])

        metrics["list_cost_usd"] = list_cost
        metrics["cisco_cost_usd"] = round(list_cost * CISCO_DISCOUNT_MULTIPLIER, 6)

    except Exception:
        pass

    return metrics


def cleanup_old_state_files(max_age_days=7):
    """Remove session state files older than max_age_days."""
    try:
        cutoff = datetime.now().timestamp() - (max_age_days * 86400)
        for state_file in STATE_DIR.glob("*.json"):
            if state_file.stat().st_mtime < cutoff:
                state_file.unlink()
    except Exception:
        pass


def get_git_activity(cwd):
    """Get git changes"""
    git = {"lines_added": 0, "lines_removed": 0, "files_changed": 0, "is_repo": False}

    try:
        if subprocess.run(["git", "rev-parse", "--git-dir"], cwd=cwd,
                         capture_output=True, timeout=2).returncode == 0:
            git["is_repo"] = True

            status = subprocess.run(["git", "status", "--porcelain"], cwd=cwd,
                                   capture_output=True, text=True, timeout=2)
            if status.returncode == 0 and status.stdout.strip():
                git["files_changed"] = len(status.stdout.strip().split('\n'))

                diff = subprocess.run(["git", "diff", "--numstat"], cwd=cwd,
                                    capture_output=True, text=True, timeout=2)
                if diff.returncode == 0:
                    for line in diff.stdout.strip().split('\n'):
                        parts = line.split('\t')
                        if len(parts) >= 2:
                            try:
                                git["lines_added"] += int(parts[0]) if parts[0] != '-' else 0
                                git["lines_removed"] += int(parts[1]) if parts[1] != '-' else 0
                            except ValueError:
                                pass
    except Exception:
        pass

    return git


def build_splunk_event(hook_data, log_file=None):
    """Build minimal event with only dashboard-required fields"""

    username = get_username()
    otel_attrs = parse_otel_attributes()

    # Core event
    event = {
        "event_type": hook_data.get("hook_type", "PostToolUse"),
        "session_id": hook_data.get("session_id", "unknown"),
        "user": username,
        "manager": otel_attrs.get("manager", "unknown"),
        "organization": otel_attrs.get("organization", "unknown"),
        "cec": otel_attrs.get("cec", username),
        "terminal": get_terminal()
    }

    # Parse transcript and calculate delta
    transcript_path = hook_data.get("transcript_path")
    session_id = hook_data.get("session_id")

    current = parse_transcript(transcript_path, session_id)
    previous = load_session_state(session_id)

    # Detect transcript parse regression (unreadable transcript returns zeros)
    transcript_regression = (
        current["list_cost_usd"] < previous["list_cost_usd"]
        or current["total_tokens"]["input"] < previous["total_tokens"]["input"]
    )

    if transcript_regression:
        if log_file:
            with open(log_file, "a") as f:
                f.write(
                    f"  WARNING: Transcript regression detected (current < previous) "
                    f"— skipping state update, reporting 0 deltas\n"
                )
        delta_input = delta_output = delta_cache_read = 0
        delta_list_cost = delta_cisco_cost = 0.0
    else:
        delta_input = max(0, current["total_tokens"]["input"] - previous["total_tokens"]["input"])
        delta_output = max(0, current["total_tokens"]["output"] - previous["total_tokens"]["output"])
        delta_cache_read = max(0, current["total_tokens"]["cache_read"] - previous["total_tokens"]["cache_read"])
        delta_list_cost = max(0.0, current["list_cost_usd"] - previous["list_cost_usd"])
        delta_cisco_cost = max(0.0, current["cisco_cost_usd"] - previous["cisco_cost_usd"])

    # Session duration tracking
    now_ts = datetime.now().timestamp()
    hook_type = hook_data.get("hook_type", "PostToolUse")

    if hook_type == "SessionStart":
        if not transcript_regression:
            save_session_state(session_id, current, start_time=now_ts)
        event["session_start_time"] = now_ts
        # Cleanup old state files on session start
        cleanup_old_state_files()
    elif hook_type == "SessionEnd":
        start_time = previous.get("start_time")
        if start_time:
            duration_seconds = int(now_ts - start_time)
            event["session_duration_seconds"] = duration_seconds
            event["session_duration_hours"] = round(duration_seconds / 3600.0, 2)
            if log_file:
                with open(log_file, "a") as f:
                    f.write(f"  DEBUG: Calculated duration: {duration_seconds}s ({event['session_duration_hours']}h)\n")
        else:
            if log_file:
                with open(log_file, "a") as f:
                    f.write(f"  WARNING: SessionEnd without start_time - cannot calculate duration\n")
        if not transcript_regression:
            save_session_state(session_id, current, start_time=start_time)
    else:
        if not transcript_regression:
            save_session_state(session_id, current, start_time=previous.get("start_time"))

    # Dashboard fields only
    event.update({
        "model": current["model"],
        "total_input_tokens": delta_input,
        "total_output_tokens": delta_output,
        "total_cache_read_tokens": delta_cache_read,
        "total_tokens": delta_input + delta_output,
        "list_cost_usd": delta_list_cost,
        "cisco_cost_usd": delta_cisco_cost
    })

    # Tool name for pie chart
    if "tool_name" in hook_data:
        event["tool_name"] = hook_data["tool_name"]

    # Git metrics for code changes panel
    git = get_git_activity(hook_data.get("cwd", os.getcwd()))
    if git["is_repo"]:
        event.update({
            "git_repo": True,
            "git_lines_added": git["lines_added"],
            "git_lines_removed": git["lines_removed"],
            "git_files_changed": git["files_changed"]
        })

    return {
        "time": int(datetime.now().timestamp()),
        "host": get_hostname(),
        "source": "claude-code-cli",
        "sourcetype": SPLUNK_SOURCETYPE,
        "index": SPLUNK_INDEX,
        "event": event
    }


def main():
    log_file = Path.home() / ".claude" / "logs" / "hec_debug.log"
    try:
        stdin_data = sys.stdin.read().strip()
        if not stdin_data:
            print("{}")
            sys.exit(0)

        hook_data = json.loads(stdin_data)

        # Determine hook_type from hook_event_name (the actual field Claude uses)
        hook_event_name = hook_data.get("hook_event_name", "")

        if "tool_name" in hook_data:
            hook_data["hook_type"] = "PostToolUse"
        elif hook_event_name == "SessionStart" or hook_data.get("source") == "session_start":
            hook_data["hook_type"] = "SessionStart"
        elif hook_event_name == "SessionEnd" or "reason" in hook_data:
            hook_data["hook_type"] = "SessionEnd"
        else:
            hook_data["hook_type"] = "PostToolUse"

        # Debug log
        with open(log_file, "a") as f:
            f.write(f"{datetime.now().isoformat()} - hook_event_name: '{hook_event_name}', detected as: {hook_data['hook_type']}\n")

        event = build_splunk_event(hook_data, log_file)
        send_to_splunk(event)

        with open(log_file, "a") as f:
            f.write(f"  ✓ Sent {hook_data['hook_type']} event\n")

    except Exception as e:
        import traceback
        with open(log_file, "a") as f:
            f.write(f"{datetime.now().isoformat()} - Error: {str(e)}\n")
            f.write(traceback.format_exc())

    print("{}")
    sys.exit(0)


if __name__ == "__main__":
    main()
