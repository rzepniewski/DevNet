---
name: opencode-cleanup
description: Clean up OpenCode config, caches, stale sessions, temp files, and optimize storage
---

# OpenCode Cleanup

You are an expert at maintaining a clean, efficient OpenCode installation on macOS. You know the directory structure, file purposes, and safe cleanup operations — and critically, what NOT to delete.

## OpenCode Directory Structure

```
~/.config/opencode/
├── config.json          # Main config — DO NOT DELETE
├── opencode.json        # Project MCP config — DO NOT DELETE
├── skills/              # User skills — DO NOT DELETE unless explicitly requested
├── commands/            # Slash commands — DO NOT DELETE unless explicitly requested
├── node_modules/        # npm packages (oh-my-opencode, etc.) — safe to delete + reinstall
└── .cache/              # Various caches — generally safe to clean

~/.local/share/opencode/
├── sessions/            # Chat session history
├── logs/                # Application logs
└── tmp/                 # Temporary files — safe to delete

/tmp/opencode-*/         # Process temp files — safe to delete after process exits
```

## Safe Cleanup Operations

### Clear session history
```bash
# List sessions with sizes
du -sh ~/.local/share/opencode/sessions/*/

# Delete sessions older than 30 days
find ~/.local/share/opencode/sessions -maxdepth 1 -type d -mtime +30 -exec rm -rf {} +

# Delete ALL sessions (nuclear option — loses all chat history)
rm -rf ~/.local/share/opencode/sessions/*
```

### Clear logs
```bash
# Show log sizes
du -sh ~/.local/share/opencode/logs/

# Truncate logs (keeps files, clears content)
find ~/.local/share/opencode/logs -name "*.log" -exec truncate -s 0 {} \;

# Delete old logs
find ~/.local/share/opencode/logs -name "*.log" -mtime +7 -delete
```

### Clear caches
```bash
# OpenCode cache
rm -rf ~/.config/opencode/.cache/

# npm cache for opencode packages
npm cache clean --force 2>/dev/null || true

# Bun cache
bun pm cache rm 2>/dev/null || true
```

### Reinstall oh-my-opencode skills package
```bash
cd ~/.config/opencode
rm -rf node_modules package-lock.json
npm install oh-my-opencode@latest
```

### Clear tmp files
```bash
# OpenCode process temp files
rm -rf /tmp/opencode-*
rm -rf /var/folders/*/T/opencode-* 2>/dev/null || true
```

## Diagnostic Commands

### Check disk usage
```bash
# Overall opencode storage
du -sh ~/.config/opencode/ ~/.local/share/opencode/ 2>/dev/null

# Sessions breakdown
du -sh ~/.local/share/opencode/sessions/* 2>/dev/null | sort -rh | head -20

# Find large files
find ~/.config/opencode ~/.local/share/opencode -size +10M -type f 2>/dev/null
```

### Check skill health
```bash
# Count skills
find ~/.config/opencode/skills -name "SKILL.md" | wc -l

# Find skills without SKILL.md
find ~/.config/opencode/skills -mindepth 1 -maxdepth 1 -type d | while read d; do
  [ ! -f "$d/SKILL.md" ] && echo "Missing SKILL.md: $d"
done

# Validate YAML frontmatter
for f in ~/.config/opencode/skills/*/SKILL.md; do
  head -20 "$f" | grep -q "^name:" || echo "Missing name: $f"
done
```

### Check commands
```bash
# List all commands
ls ~/.config/opencode/commands/ 2>/dev/null
ls ~/.claude/commands/ 2>/dev/null

# Find commands not mirrored in both locations
diff <(ls ~/.config/opencode/commands/ 2>/dev/null | sort) \
     <(ls ~/.claude/commands/ 2>/dev/null | sort)
```

## Full Cleanup Script

```bash
#!/bin/bash
# OpenCode full cleanup — run interactively

echo "=== OpenCode Cleanup ==="
echo ""

# Show current sizes
echo "Current disk usage:"
du -sh ~/.config/opencode/ ~/.local/share/opencode/ 2>/dev/null

echo ""
echo "Session count: $(ls ~/.local/share/opencode/sessions/ 2>/dev/null | wc -l)"

echo ""
read -p "Delete sessions older than 30 days? [y/N] " yn
if [[ "$yn" == "y" ]]; then
  find ~/.local/share/opencode/sessions -maxdepth 1 -type d -mtime +30 -exec rm -rf {} +
  echo "Done."
fi

echo ""
read -p "Clear logs? [y/N] " yn
if [[ "$yn" == "y" ]]; then
  find ~/.local/share/opencode/logs -name "*.log" -mtime +3 -delete 2>/dev/null
  echo "Done."
fi

echo ""
read -p "Clear caches? [y/N] " yn
if [[ "$yn" == "y" ]]; then
  rm -rf ~/.config/opencode/.cache/
  echo "Done."
fi

echo ""
echo "=== Done. Final sizes: ==="
du -sh ~/.config/opencode/ ~/.local/share/opencode/ 2>/dev/null
```

## What NOT to Delete

- `~/.config/opencode/config.json` — Main configuration
- `~/.config/opencode/opencode.json` — MCP server definitions
- `~/.config/opencode/skills/` — Your custom skills
- `~/.config/opencode/commands/` — Your slash commands
- `~/.claude/commands/` — Claude commands (mirror)
- `~/.claude/CLAUDE.md` — Global Claude instructions
- Any session you might want to reference later
