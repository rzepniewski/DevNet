---
name: radkit-mcp-setup
description: Configure the RADKit MCP server for AI-assisted remote device access and network automation
---

# RADKit MCP Setup

You have expertise in configuring the RADKit MCP (Model Context Protocol) server to enable AI assistants to interact with customer network devices via RADKit.

## What This Does

The RADKit MCP server exposes RADKit's device access capabilities as MCP tools, enabling Claude and other AI agents to:
- Execute CLI commands on remote devices
- Retrieve device configurations and state
- Run diagnostic sequences
- Interact with network devices during support engagements

## Installation

```bash
# Install RADKit MCP server
npm install -g @cisco/radkit-mcp

# Or via uvx (Python)
uvx radkit-mcp
```

## OpenCode Configuration

Add to your `~/.config/opencode/opencode.json`:

```json
{
  "mcp": {
    "radkit": {
      "command": "npx",
      "args": ["-y", "@cisco/radkit-mcp"],
      "env": {
        "RADKIT_SERVICE_URL": "https://radkit.cisco.com",
        "RADKIT_CERT_PATH": "~/.radkit/certs/client.p12"
      }
    }
  }
}
```

## Claude Desktop Configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "radkit": {
      "command": "npx",
      "args": ["-y", "@cisco/radkit-mcp"],
      "env": {
        "RADKIT_SERVICE_URL": "https://radkit.cisco.com"
      }
    }
  }
}
```

## Available MCP Tools (after setup)

- `radkit_connect` — Establish session to a device via SR
- `radkit_exec` — Execute a CLI command and return output
- `radkit_get_config` — Retrieve running/startup configuration
- `radkit_list_devices` — List devices accessible in current SR

## Verification

```bash
# Test MCP server starts cleanly
npx -y @cisco/radkit-mcp --test

# Verify tools are exposed
# In Claude: "List available RADKit tools"
```

## Key Notes

- MCP server requires an active RADKit certificate (see `radkit-certificate-auth` skill)
- Session is scoped to SR — devices accessible only while SR is active
- MCP server spawns a subprocess per session; clean up with `radkit-client session close`
