---
id: installation
title: Installation
sidebar_position: 1
---

# DeckCraft — Installation

## For Humans

Paste this one-liner into your AI coding assistant (Claude Code, GitHub Copilot, etc.):

> Install and configure DeckCraft by following the instructions here:
> `https://wwwin-github.cisco.com/raw/cx-automation-utils/deckcraft/refs/heads/main/installation.md`

### Manual Alternative

If you prefer to install manually:

```bash
git clone git@wwwin-github.cisco.com:cx-automation-utils/deckcraft.git /tmp/deckcraft
```

Then copy the artifacts into your `~/.claude/` directory. See the **For LLM Agents** section in the [full installation guide](https://wwwin-github.cisco.com/raw/cx-automation-utils/deckcraft/refs/heads/main/installation.md) for the exact paths.

---

## For LLM Agents

Follow these steps in order. Execute each command and verify it succeeds before proceeding.

### Step 1: Clone the Repository

```bash
git clone git@wwwin-github.cisco.com:cx-automation-utils/deckcraft.git /tmp/deckcraft || \
  git clone https://wwwin-github.cisco.com/cx-automation-utils/deckcraft.git /tmp/deckcraft
```

Verify:

```bash
ls /tmp/deckcraft
```

### Step 2: Install the Skill

Copy the skill files into `~/.claude/`:

```bash
mkdir -p ~/.claude/skills
cp -r /tmp/deckcraft/deckcraft ~/.claude/skills/deckcraft
```

Verify:

```bash
ls ~/.claude/skills/deckcraft
```

### Step 3: Done

DeckCraft is now installed. Ask Claude to create a presentation — for example:

> "Create a 10-slide corporate presentation on Q4 results using the dark theme and corporate profile."
