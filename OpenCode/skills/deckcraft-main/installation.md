# DeckCraft — Installation Guide

## For Humans

Paste this one-liner into your AI coding assistant (Claude Code, etc.):

> Install and configure DeckCraft by following the instructions here:
> https://wwwin-github.cisco.com/raw/cx-automation-utils/deckcraft/refs/heads/main/installation.md

### Manual Alternative

If you prefer to install manually:

```bash
git clone git@wwwin-github.cisco.com:cx-automation-utils/deckcraft.git /tmp/deckcraft
```

Then copy the artifacts you need into your `~/.claude/` directory. See the "For LLM Agents" section below for the exact paths.

---

## For LLM Agents

Follow these steps in order. Execute each command and verify it succeeds before proceeding.

### Step 1: Clone the Repository

Clone via SSH. If SSH fails, fall back to HTTPS.

```bash
git clone git@wwwin-github.cisco.com:cx-automation-utils/deckcraft.git /tmp/deckcraft || \
  git clone https://wwwin-github.cisco.com/cx-automation-utils/deckcraft.git /tmp/deckcraft
```

Verify the clone succeeded:

```bash
ls /tmp/deckcraft
```

### Step 2: Install Artifacts

Create the target directories if they do not exist, then copy each artifact.

#### Skills

```bash
mkdir -p ~/.claude/skills
cp -r /tmp/deckcraft/deckcraft ~/.claude/skills/deckcraft
```

### Step 3: Verify Installation

Confirm the artifacts are in place:

```bash
echo "=== Installed Artifacts ==="
echo "Skills:" && ls ~/.claude/skills/ 2>/dev/null || echo "  (none)"
```

### Step 4: Cleanup

Remove the temporary clone:

```bash
rm -rf /tmp/deckcraft
```

Installation complete. Present a summary table to the user:

> | Artifact | Type | Location |
> |----------|------|----------|
> | deckcraft | skill | ~/.claude/skills/deckcraft |
>
> **Restart required:** Please restart your AI coding assistant (e.g. Claude Code) for the newly installed artifacts to take effect.
