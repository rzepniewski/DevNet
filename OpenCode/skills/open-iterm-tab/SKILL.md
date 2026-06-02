---
name: open-iterm-tab
description: Open a new iTerm2 tab with a specified working directory and optional command, using AppleScript or shell automation
mcp:
  filesystem:
    command: npx
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/Users/przepnie"]
---

# Open iTerm2 Tab

You automate opening new iTerm2 tabs via AppleScript. When this skill is loaded, you generate and execute scripts to launch terminal tabs with the right working directory and optional startup command.

## Core AppleScript Pattern

```applescript
tell application "iTerm2"
  tell current window
    create tab with default profile
    tell current session of current tab
      write text "cd /path/to/directory && [optional command]"
    end tell
  end tell
end tell
```

## Usage Patterns

### Open a tab in a specific directory
```applescript
tell application "iTerm2"
  tell current window
    create tab with default profile
    tell current session of current tab
      write text "cd ~/projects/my-project"
    end tell
  end tell
end tell
```

### Open a tab and run a command
```applescript
tell application "iTerm2"
  tell current window
    create tab with default profile
    tell current session of current tab
      write text "cd ~/projects/my-project && make dev"
    end tell
  end tell
end tell
```

### Open multiple tabs for a project (dev workflow)
```applescript
-- Tab 1: editor
tell application "iTerm2"
  tell current window
    create tab with default profile
    tell current session of current tab
      write text "cd ~/projects/my-project && opencode ."
    end tell
  end tell
end tell

-- Tab 2: server
tell current window of application "iTerm2"
  create tab with default profile
  tell current session of current tab of current window of application "iTerm2"
    write text "cd ~/projects/my-project && make dev"
  end tell
end tell
```

## Shell Execution
Run AppleScript from command line:
```bash
osascript -e 'tell application "iTerm2" to ...'
# or from a file:
osascript ~/scripts/open-project.applescript
```

## New Window Instead of Tab
```applescript
tell application "iTerm2"
  create window with default profile
  tell current session of current tab of current window
    write text "cd /path/to/dir"
  end tell
end tell
```

## Behavior
- Always use `iTerm2` (capital I and T) as the application name
- Use `write text` not `write` to avoid sending a newline without the command
- If iTerm2 is not running, AppleScript will launch it automatically
- Prefer `create tab with default profile` over named profiles for portability
- When given a project path, infer sensible startup commands from project type (Makefile → `make dev`, package.json → `npm run dev`, etc.)
