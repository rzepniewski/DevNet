---
name: open-remote-opencode-tmux
description: Connect to and manage remote OpenCode sessions via tmux — attach, create, list, and send commands to remote AI coding sessions over SSH
---

# Remote OpenCode via tmux

You help establish, manage, and interact with OpenCode sessions running on remote hosts via SSH + tmux. When this skill is loaded, you generate the right ssh/tmux commands for remote AI coding workflows.

## Core Workflow

### 1. Start a persistent OpenCode session on remote host
```bash
# SSH to remote host
ssh user@remote-host

# Create a named tmux session for OpenCode
tmux new-session -d -s opencode -c /path/to/project

# Start OpenCode inside the session
tmux send-keys -t opencode "opencode ." Enter

# Detach and return to local machine
# Ctrl+B, D
```

### 2. Attach from local machine
```bash
# SSH + attach to existing tmux session in one command
ssh -t user@remote-host "tmux attach-session -t opencode"
```

### 3. Create if not exists, attach if exists
```bash
ssh -t user@remote-host "tmux new-session -A -s opencode -c /path/to/project"
```

### 4. List running sessions on remote
```bash
ssh user@remote-host "tmux list-sessions"
```

### 5. Send a message to running OpenCode session
```bash
# Send text to the OpenCode session without attaching
ssh user@remote-host "tmux send-keys -t opencode 'your message here' Enter"
```

## Shell Alias (add to ~/.zprofile or ~/.zshrc)
```bash
# Connect to remote OpenCode session (create or attach)
alias roc='ssh -t user@remote-host "tmux new-session -A -s opencode -c ~/projects"'

# Send a command to remote OpenCode without attaching
rocrun() {
  ssh user@remote-host "tmux send-keys -t opencode '$*' Enter"
}
```

## Multi-Project Setup
```bash
# Start separate sessions per project
tmux new-session -d -s proj-alpha -c ~/projects/alpha
tmux new-session -d -s proj-beta  -c ~/projects/beta

# Attach to specific project
ssh -t user@remote-host "tmux attach-session -t proj-alpha"
```

## tmux Key Bindings (inside session)
| Key | Action |
|-----|--------|
| `Ctrl+B, D` | Detach (session keeps running) |
| `Ctrl+B, [` | Scroll mode (navigate output) |
| `Ctrl+B, $` | Rename session |
| `Ctrl+B, S` | List and switch sessions |
| `Ctrl+B, C` | Create new window |
| `Ctrl+B, N/P` | Next/previous window |

## tmux Session Persistence
```bash
# Install tmux-resurrect for session persistence across reboots (on remote)
# Add to ~/.tmux.conf:
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
set -g @continuum-restore 'on'
```

## Troubleshooting
- **Session not found**: `tmux list-sessions` to see what exists; use `new-session -A` to create-or-attach
- **OpenCode not responding**: `tmux send-keys -t opencode '' Enter` to send a blank line and wake it
- **Port forwarding for web UI**: `ssh -L 3000:localhost:3000 user@remote-host`
- **Slow connection**: Use `tmux set -g mouse on` and `tmux set -g status-interval 5` to reduce network chatter

## Behavior
- Always use named tmux sessions (not anonymous) for remote work
- Prefer `new-session -A` (create or attach) over separate create/attach logic
- When given a remote host and project path, generate a complete one-liner to connect
- If the user wants to run OpenCode on a Cisco DevNet sandbox or lab server, adjust the SSH target accordingly
