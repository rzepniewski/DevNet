---
name: watch-context
description: Watch files and directories for changes and dynamically update agent context
---

# Watch Context

You are an expert at monitoring file system changes and keeping agent context synchronized with the current state of the workspace. You help users set up file watchers, understand what changed, and react intelligently to those changes.

## Core Capabilities

### File System Watching
- Use `fswatch`, `inotifywait`, or Node.js `chokidar` to monitor directories
- Filter events by type: created, modified, deleted, renamed, moved
- Debounce rapid changes to avoid noise
- Watch recursively or shallowly as needed

### Context Update Patterns

When files change, re-read affected files and update your understanding:
```bash
# macOS fswatch one-liner
fswatch -o ./src | xargs -n1 -I{} echo "Change detected, re-reading context"

# Watch specific extensions
fswatch -e ".*" -i "\.ts$" ./src

# With event types
fswatch --event Created --event Updated --event Removed ./src
```

### Shell Integration

```bash
# Background watcher that logs changes
fswatch -r ./src > /tmp/changes.log &
WATCH_PID=$!

# Stop watcher
kill $WATCH_PID
```

### Node.js chokidar (programmatic)
```javascript
const chokidar = require('chokidar');

const watcher = chokidar.watch('./src', {
  ignored: /(^|[\/\\])\..|(node_modules)/,
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 100 }
});

watcher
  .on('add', path => console.log(`File ${path} added`))
  .on('change', path => console.log(`File ${path} changed`))
  .on('unlink', path => console.log(`File ${path} removed`));
```

## Workflow Integration

### Auto-reload on change
When watching for context updates in an AI workflow:
1. Watch the target files/directories
2. On change event → re-read changed files
3. Summarize what changed (additions, deletions, modifications)
4. Update your mental model of the codebase state
5. Proceed with the task using fresh context

### What to watch
- Source files during active development (`src/`, `lib/`)
- Config files that affect behavior (`*.json`, `*.yaml`, `*.toml`)
- Test files to track coverage changes
- Log files for real-time debugging context
- Output directories to detect build completion

### Ignoring noise
Always ignore:
- `node_modules/`, `.git/`, `dist/`, `build/`, `.cache/`
- Binary files, images, compiled artifacts
- Temporary files (`*.tmp`, `*.swp`, `*~`)
- IDE files (`.idea/`, `.vscode/`)

## Context Diff Reporting

When files change, report in this format:
```
CONTEXT UPDATE — <timestamp>
Changed: src/auth/middleware.ts
  + Added: validateToken() function (lines 45-67)
  ~ Modified: AuthError class constructor
  - Removed: legacyAuth() function

Impact: Auth middleware now validates tokens inline. Update tests accordingly.
```

## Best Practices

- **Debounce**: Wait 200–500ms after last event before processing (avoids partial-write reads)
- **Atomic reads**: Read the entire file after change, not just the diff
- **Selective watching**: Only watch what's relevant to the current task
- **Resource limits**: macOS has limits on open file descriptors (`kern.maxfilesperproc`). Increase if needed: `sudo sysctl -w kern.maxfilesperproc=65536`
- **Polling fallback**: Use polling mode for network filesystems or Docker volumes where native events are unreliable
