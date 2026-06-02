---
name: mcp-server-configuration
description: Configure and manage MCP servers in OpenCode — local, remote, OAuth, and stdio transports
---

# MCP Server Configuration

You are an expert at configuring Model Context Protocol (MCP) servers in OpenCode. You understand all transport types, authentication patterns, and the opencode.json configuration format.

## Configuration File Locations

```
~/.config/opencode/config.json     # Global user config (applies to all projects)
./opencode.json                    # Project-level config (in project root)
```

Project config overrides global config for matching keys.

## opencode.json Structure

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "provider": {
    "anthropic": {
      "apiKey": "sk-ant-..."
    }
  },
  "mcp": {
    "server-name": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@package/mcp-server"],
      "env": {
        "API_KEY": "${MY_ENV_VAR}"
      }
    }
  }
}
```

## Transport Types

### Local (stdio) — Most Common
```json
{
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/projects"]
    },
    "github": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### Remote (SSE/HTTP)
```json
{
  "mcp": {
    "remote-server": {
      "type": "remote",
      "url": "https://mcp.example.com/sse"
    }
  }
}
```

### Remote with OAuth
```json
{
  "mcp": {
    "cisco-docs": {
      "type": "remote",
      "url": "https://docs-ai.cisco.com/mcp",
      "auth": "oauth2"
    }
  }
}
```

### Remote with API Key header
```json
{
  "mcp": {
    "my-api": {
      "type": "remote",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${MY_API_KEY}"
      }
    }
  }
}
```

## Popular MCP Servers

### Official Anthropic servers
```json
{
  "filesystem": {
    "type": "local",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allow"]
  },
  "github": {
    "type": "local",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}" }
  },
  "postgres": {
    "type": "local",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
  },
  "brave-search": {
    "type": "local",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-brave-search"],
    "env": { "BRAVE_API_KEY": "${BRAVE_API_KEY}" }
  }
}
```

### Playwright (browser automation)
```json
{
  "playwright": {
    "type": "local",
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest"]
  }
}
```

### Context7 (documentation)
```json
{
  "context7": {
    "type": "local",
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp@latest"]
  }
}
```

### Exa web search
```json
{
  "exa": {
    "type": "local",
    "command": "npx",
    "args": ["-y", "exa-mcp-server"],
    "env": { "EXA_API_KEY": "${EXA_API_KEY}" }
  }
}
```

## Environment Variable Interpolation

Use `${VAR_NAME}` syntax to reference environment variables:
```json
{
  "env": {
    "API_KEY": "${MY_SECRET_KEY}",
    "BASE_URL": "${API_BASE_URL}"
  }
}
```

Variables are read from the shell environment at OpenCode startup. Set them in `~/.zprofile` or `~/.zshrc`.

## Debugging MCP Servers

```bash
# Test an MCP server manually
npx -y @modelcontextprotocol/inspector npx -y @modelcontextprotocol/server-github

# Check if a server starts without errors
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | npx -y @modelcontextprotocol/server-filesystem /tmp

# View OpenCode logs for MCP errors
cat ~/.local/share/opencode/logs/*.log | grep -i "mcp\|error" | tail -50
```

## Best Practices

- **Minimal permissions**: For filesystem server, only allow directories you need
- **Env vars for secrets**: Never hardcode API keys — always use `${VAR}`
- **Project vs global**: Put project-specific servers in `./opencode.json`, general-purpose in `~/.config/opencode/config.json`
- **Version pin**: For stability, pin npm package versions: `["@package/mcp@1.2.3"]` instead of `["@package/mcp@latest"]`
- **Test before adding**: Run the MCP inspector to verify a server works before adding to config
- **Disable unused servers**: Remove or comment out servers you're not using — they add startup time

## Skill-Embedded MCP Servers

Skills can bundle their own MCP server via SKILL.md frontmatter:
```yaml
---
name: my-skill
description: A skill with embedded MCP
mcp:
  my-tool:
    command: npx
    args: ["-y", "my-mcp-package"]
    env:
      TOKEN: "${MY_TOKEN}"
---
```

The server is only active when the skill is loaded.
