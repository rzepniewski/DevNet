---
name: statusline-setup
description: Configure terminal statusline tools — Starship, Powerlevel10k, and tmux status bar — with sensible defaults and Cisco-aware prompts
---

# Terminal Statusline Setup

You configure terminal statusline and prompt tools: Starship (cross-shell), Powerlevel10k (Zsh), and tmux status bar. When this skill is loaded, you generate configurations, explain segments, and help customize the prompt for engineering workflows.

## Starship (Recommended — cross-shell, fast)

### Installation
```bash
brew install starship
# Add to ~/.zprofile or ~/.zshrc:
eval "$(starship init zsh)"
```

### Config location: `~/.config/starship.toml`

### Recommended config for Cisco engineers:
```toml
# ~/.config/starship.toml
format = """
$username\
$hostname\
$directory\
$git_branch\
$git_status\
$python\
$node\
$golang\
$docker_context\
$cmd_duration\
$line_break\
$character"""

[username]
show_always = false
format = "[$user]($style)@"
style_user = "bold green"

[hostname]
ssh_only = true
format = "[$hostname]($style) "
style = "bold yellow"
trim_at = ".cisco.com"

[directory]
truncation_length = 4
truncate_to_repo = true
style = "bold cyan"

[git_branch]
format = "[$symbol$branch]($style) "
symbol = " "
style = "bold purple"

[git_status]
format = '([\[$all_status$ahead_behind\]]($style) )'
style = "bold red"

[python]
format = '[${symbol}${pyenv_prefix}(${version} )(\($virtualenv\) )]($style)'
symbol = " "

[cmd_duration]
min_time = 2_000
format = "took [$duration]($style) "
style = "bold yellow"

[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"
```

## Powerlevel10k (Zsh only — most customizable)

### Installation
```bash
brew install powerlevel10k
# Add to ~/.zshrc:
source $(brew --prefix)/share/powerlevel10k/powerlevel10k.zsh-theme
# Run wizard:
p10k configure
```

### Key p10k segments to enable:
- `dir` — current directory
- `vcs` — git status
- `virtualenv` / `pyenv` — Python env
- `node_version` — Node.js
- `command_execution_time` — slow command detection
- `status` — exit code indicator

### Minimal ~/.p10k.zsh overrides:
```zsh
# Show hostname only over SSH
typeset -g POWERLEVEL9K_CONTEXT_SHOW_ON_COMMAND='ssh|sudo|su'

# Shorten directory to 3 segments
typeset -g POWERLEVEL9K_SHORTEN_STRATEGY=truncate_to_unique
typeset -g POWERLEVEL9K_SHORTEN_DIR_LENGTH=3
```

## tmux Status Bar

### Add to `~/.tmux.conf`:
```tmux
# Status bar position
set -g status-position bottom
set -g status-style 'bg=colour235 fg=colour255'

# Left: session name
set -g status-left '#[bold,fg=colour040] #S #[default]'
set -g status-left-length 20

# Right: host + time
set -g status-right '#[fg=colour245]#H  #[fg=colour255,bold]%H:%M %d-%b'
set -g status-right-length 50

# Active window highlight
setw -g window-status-current-style 'fg=colour040 bold'
setw -g window-status-current-format ' #I:#W#F '

# Refresh interval
set -g status-interval 5
```

## Nerd Fonts (required for icons)
```bash
brew install --cask font-meslo-lg-nerd-font
# Set terminal font to: MesloLGS NF or MesloLGMDZ Nerd Font
```

## Behavior
- Always recommend Starship for new setups (cross-shell, no plugin manager needed)
- For existing Zsh + Oh My Zsh users, suggest Powerlevel10k
- Always include `ssh_only = true` for hostname to avoid cluttering local prompts
- Show `cmd_duration` for commands > 2s — essential for long-running network ops
- When configuring for a specific shell (bash, zsh, fish), output the correct init snippet
