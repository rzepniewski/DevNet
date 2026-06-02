#!/usr/bin/env python3
"""
Shared Splunk HEC utilities for Claude Code hooks.
Used by send_to_splunk_hec.py and user_prompt_submit.py.
"""

import json
import os
import subprocess
from pathlib import Path

# Default Splunk HEC Configuration (overridable via ~/.claude/hooks/.env)
_DEFAULT_SPLUNK_HEC_URL = "https://svs-splunk-sink1.cisco.com:8088/services/collector/event"
_DEFAULT_SPLUNK_HEC_TOKEN = "58c81854-53ed-4e1c-9382-bcbfdcabf50d"
SPLUNK_INDEX = "svs_lab_prod_events"


def _load_env_file():
    """Load HEC config from ~/.claude/hooks/.env if it exists."""
    env_file = Path.home() / ".claude" / "hooks" / ".env"
    overrides = {}
    if env_file.exists():
        try:
            for line in env_file.read_text().splitlines():
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    overrides[key.strip()] = val.strip().strip('"').strip("'")
        except Exception:
            pass
    return overrides


_env_overrides = _load_env_file()
SPLUNK_HEC_URL = _env_overrides.get("SPLUNK_HEC_URL", _DEFAULT_SPLUNK_HEC_URL)
SPLUNK_HEC_TOKEN = _env_overrides.get("SPLUNK_HEC_TOKEN", _DEFAULT_SPLUNK_HEC_TOKEN)


def parse_otel_attributes():
    """Parse OTEL_RESOURCE_ATTRIBUTES for manager, organization, cec."""
    attrs = {}
    otel_attrs = os.environ.get("OTEL_RESOURCE_ATTRIBUTES", "")
    for pair in otel_attrs.split(","):
        if "=" in pair:
            key, val = pair.split("=", 1)
            attrs[key.strip()] = val.strip()
    return attrs


def get_terminal():
    """Get terminal identifier."""
    return os.environ.get("TERM_PROGRAM") or os.environ.get("TERM") or "unknown"


def get_username():
    """Get username from home directory."""
    return Path.home().name


def get_hostname():
    """Get hostname."""
    return os.uname().nodename if hasattr(os, "uname") else "unknown"


def send_to_splunk(payload, timeout_seconds=5):
    """Send payload to Splunk HEC. Returns True on success."""
    try:
        result = subprocess.run(
            [
                "curl", "-k", "-X", "POST", SPLUNK_HEC_URL,
                "-H", f"Authorization: Splunk {SPLUNK_HEC_TOKEN}",
                "-H", "Content-Type: application/json",
                "-d", json.dumps(payload),
                "--max-time", str(timeout_seconds),
                "--silent", "--show-error",
            ],
            capture_output=True,
            text=True,
            timeout=timeout_seconds + 1,
        )
        return result.returncode == 0
    except Exception:
        return False
