# Python venv, pip, pipx — Complete Guide

A practical reference for managing Python environments on macOS (zsh).
Covers setup, daily workflow, additional tools, verification, common problems,
and troubleshooting.

---

## Table of Contents

1. [Concepts](#1-concepts)
2. [Installing & Updating Python](#2-installing--updating-python)
3. [Virtual Environments (`venv`)](#3-virtual-environments-venv)
4. [Managing Multiple Python Versions](#4-managing-multiple-python-versions)
5. [pip — Installing Packages](#5-pip--installing-packages)
6. [pipx — Global CLI Tools](#6-pipx--global-cli-tools)
7. [Useful Tools (black, ruff, httpie, yt-dlp, pytest)](#7-useful-tools)
8. [Verification Checklist](#8-verification-checklist)
9. [Common Problems & Troubleshooting](#9-common-problems--troubleshooting)
10. [Quick Reference Cheatsheet](#10-quick-reference-cheatsheet)

---

## 1. Concepts

| Term | What it is |
|---|---|
| **Python interpreter** | The `python` / `python3` executable that runs `.py` files |
| **pip** | Python's package installer (e.g. `pip install requests`) |
| **venv** | A built-in tool that creates isolated Python environments per project |
| **pipx** | Installs Python CLI tools in isolated venvs but exposes them globally |
| **pyenv** | Lets you install and switch between many Python versions |
| **Homebrew** | macOS package manager (`brew install ...`) |

**Golden rule:** never install packages into the system Python.
Use **venv** for project libraries, **pipx** for global CLI tools.

---

## 2. Installing & Updating Python

### Homebrew (recommended on macOS)

```bash
brew update
brew upgrade python              # update current default Python
brew install python@3.13         # install a specific version
```

Homebrew installs binaries into `/opt/homebrew/bin/` (Apple Silicon)
or `/usr/local/bin/` (Intel).

### Update pip itself

```bash
python3 -m pip install --upgrade pip
```

If you see `error: externally-managed-environment`, do this **inside a venv** instead.

### Verify

```bash
python3 --version
pip3 --version
which python3
```

---

## 3. Virtual Environments (`venv`)

### Why use a venv

- Isolates dependencies per project (no version conflicts)
- Doesn't pollute the system Python
- No `sudo` needed
- Reproducible (`requirements.txt`)
- Easy cleanup (`rm -rf .venv`)

### Create a venv (one-time, per project)

```bash
cd ~/DevNet/myproject
python3 -m venv .venv
```

This creates `.venv/` containing its own Python, pip, and `site-packages/`.

### Activate (every new terminal session)

```bash
source .venv/bin/activate         # prompt now shows (.venv)
```

### Install dependencies inside the venv

```bash
pip install --upgrade pip
pip install requests flask
pip install -r requirements.txt   # install from a file
pip freeze > requirements.txt     # save current state
```

### Deactivate

```bash
deactivate
```

### Lifecycle summary

| Command | When |
|---|---|
| `python3 -m venv .venv` | **Once** per project |
| `source .venv/bin/activate` | **Every** new terminal |
| `pip install ...` | Anytime (while activated) |
| `deactivate` | When done |

### Best practice

- One `.venv/` **per project folder** — not at workspace root.
- Add `.venv/` to `.gitignore` (don't commit it).
- VS Code auto-detects `.venv` and uses it as the interpreter.

---

## 4. Managing Multiple Python Versions

A venv reuses **whichever Python you ran `python3 -m venv` with**.
To get different versions per project:

### Option A — Homebrew (multiple installs)

```bash
brew install python@3.11 python@3.12 python@3.13

python3.11 -m venv .venv     # this venv = Python 3.11
python3.12 -m venv .venv     # this venv = Python 3.12
```

### Option B — pyenv (recommended for many versions)

```bash
brew install pyenv
```

Add to `~/.zshrc`:

```bash
export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init - zsh)"
```

Reload: `source ~/.zshrc`

Install and use a version:

```bash
pyenv install 3.13.1
pyenv global 3.13.1                    # default everywhere
pyenv local 3.11.9                     # current folder only (.python-version file)
pyenv shell 3.12.5                     # current shell only
pyenv versions                         # list installed
```

Priority order: **shell > local > global**.

---

## 5. pip — Installing Packages

### Where pip installs go

| Scope | Command | Location | When to use |
|---|---|---|---|
| **venv** ✅ | `pip install X` (with venv active) | `.venv/lib/.../site-packages/` | Project libraries |
| **User** | `pip install --user X` | `~/Library/Python/3.x/...` | Rare; often blocked on macOS |
| **System** ❌ | `sudo pip install X` | `/opt/homebrew/lib/...` | **Avoid** |

### Common pip commands

```bash
pip list                                # what's installed
pip show requests                       # details on a package
pip install requests                    # install
pip install "requests>=2.30,<3"         # with version constraints
pip install -r requirements.txt         # from file
pip install --upgrade requests          # update
pip uninstall requests                  # remove
pip freeze > requirements.txt           # snapshot all versions
pip check                               # detect dependency conflicts
```

---

## 6. pipx — Global CLI Tools

For tools you want callable from anywhere (linters, formatters, HTTP clients),
use `pipx`. Each tool gets its own isolated venv automatically.

### Setup

```bash
brew install pipx
pipx ensurepath          # adds ~/.local/bin to PATH (edits ~/.zshrc)
```

Then **open a new terminal** (or `source ~/.zshrc`).

### Usage

```bash
pipx install black                     # install a tool
pipx list                              # what's installed via pipx
pipx upgrade black                     # update one
pipx upgrade-all                       # update everything
pipx uninstall black                   # remove
pipx run cowsay hi                     # one-off without installing
```

### When to use what

| Need | Use |
|---|---|
| Library imported by your project | **venv + pip** |
| CLI tool used across many projects | **pipx** |
| One-shot command, don't want to keep | **`pipx run`** |

---

## 7. Useful Tools

| Tool | Purpose | Install |
|---|---|---|
| **black** | Opinionated Python formatter | `pipx install black` |
| **ruff** | Fast Rust-based linter + formatter (replaces flake8/isort/pylint) | `pipx install ruff` |
| **httpie** | Friendly HTTP client (curl alternative) | `pipx install httpie` |
| **yt-dlp** | Video downloader (replaces deprecated youtube-dl) | `brew install yt-dlp` |
| **pytest** | Test framework — install in **venv** if testing a project | `pip install pytest` |

### Quick examples

```bash
ruff check .                  # lint project
ruff format .                 # format project
black myfile.py               # format one file
http GET https://api.github.com/users/octocat
yt-dlp -x --audio-format mp3 <url>
pytest                        # run tests in current dir
```

---

## 8. Verification Checklist

Run these to confirm everything is set up correctly.

### Python & pip

```bash
python3 --version                       # e.g. Python 3.13.1
pip3 --version                          # shows pip + path
which python3                           # /opt/homebrew/bin/python3 (or pyenv shim)
```

### venv (with `.venv` active)

```bash
which python                            # → .../.venv/bin/python
which pip                               # → .../.venv/bin/pip
python -c "import sys; print(sys.prefix)"   # → .../.venv
pip list                                # only venv-installed packages
echo $VIRTUAL_ENV                       # → path to active .venv
```

### pipx

```bash
pipx --version
pipx list
echo $PATH | tr ':' '\n' | grep .local
which black                             # → ~/.local/bin/black
```

### pyenv (if used)

```bash
pyenv --version
pyenv versions                          # * marks active
python --version                        # matches pyenv selection
which python                            # → ~/.pyenv/shims/python
```

---

## 9. Common Problems & Troubleshooting

### Problem: `error: externally-managed-environment`

**Cause:** Trying to `pip install` into Homebrew's system Python (PEP 668 protection).

**Fix:** Use a venv or pipx.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install <package>
```

---

### Problem: `command not found` after `pipx install`

**Cause:** `~/.local/bin` not on PATH.

**Fix:**

```bash
pipx ensurepath
source ~/.zshrc        # or open a new terminal
echo $PATH | tr ':' '\n' | grep .local
```

---

### Problem: `~/.bashrc: no such file or directory`

**Cause:** macOS uses **zsh** by default, not bash.

**Fix:** Use `~/.zshrc` instead.

```bash
echo $SHELL                  # confirm /bin/zsh
nano ~/.zshrc                # edit zsh config
source ~/.zshrc              # reload
```

---

### Problem: `which pytest` shows wrong path after installing in venv

**Cause:** zsh caches command lookups per session.

**Fix:** Clear the hash cache.

```bash
hash -r                      # or: rehash
which pytest                 # now correct
```

---

### Problem: Duplicate entries in `$PATH`

**Cause:** `source ~/.zshrc` re-runs `export PATH=...` lines on top of the
already-modified PATH within the same shell.

**Fix:** Open a fresh terminal (close + reopen). The duplicates are harmless
but disappear on a clean shell start.

To inspect:

```bash
echo $PATH | tr ':' '\n'
grep -n "PATH" ~/.zshrc
```

---

### Problem: `pip install` works but `import X` fails

**Cause:** Installed in different Python than the one running your code.

**Fix:** Always invoke pip via the same interpreter:

```bash
python -m pip install <package>     # uses the python on PATH
```

Verify match:

```bash
which python
which pip
python -c "import sys; print(sys.executable)"
```

All three should agree.

---

### Problem: Created `.venv` in wrong folder

**Fix:** Just delete and recreate.

```bash
deactivate                       # if active
rm -rf .venv
cd ~/correct/project
python3 -m venv .venv
source .venv/bin/activate
```

---

### Problem: `ModuleNotFoundError` when running `pytest` (pipx version)

**Cause:** pipx-installed pytest uses its own Python, can't see your project deps.

**Fix:** Install pytest **inside** the project's venv.

```bash
source .venv/bin/activate
pip install pytest
hash -r
which pytest                     # → .venv/bin/pytest
pytest
```

---

### Problem: `pyenv` installed but `python` doesn't change versions

**Cause:** Shell init missing.

**Fix:** Add to `~/.zshrc`:

```bash
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init - zsh)"
```

Reload and verify:

```bash
source ~/.zshrc
which python                     # should be ~/.pyenv/shims/python
```

---

### Problem: VS Code doesn't pick up the venv

**Fix:**

1. Open Command Palette: `Cmd+Shift+P` → **Python: Select Interpreter**
2. Choose the one ending in `.venv/bin/python`.
3. Reload window if terminals don't auto-activate: `Cmd+Shift+P` → **Developer: Reload Window**.

---

### Problem: Want to fully reset a venv

```bash
deactivate
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 10. Quick Reference Cheatsheet

### Daily venv workflow

```bash
cd ~/DevNet/myproject
source .venv/bin/activate          # start work
pip install <pkg>                  # add dep
pip freeze > requirements.txt      # save deps
deactivate                         # done
```

### One-time project setup

```bash
cd ~/DevNet/myproject
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt    # if file exists
echo ".venv/" >> .gitignore
```

### Global CLI tool install

```bash
pipx install <tool>
pipx list
```

### Switching Python versions (with pyenv)

```bash
pyenv install 3.12.5
pyenv local 3.12.5                 # this folder
python -m venv .venv               # venv now uses 3.12.5
```

### Health check (paste this anywhere)

```bash
echo "--- shell ---"          ; echo $SHELL
echo "--- python ---"         ; which python; python --version
echo "--- pip ---"            ; which pip; pip --version
echo "--- venv ---"           ; echo "${VIRTUAL_ENV:-(none active)}"
echo "--- pipx ---"           ; which pipx; pipx --version 2>/dev/null
echo "--- PATH (.local) ---"  ; echo $PATH | tr ':' '\n' | grep -E "\.local|\.pyenv|\.venv" || echo "(none)"
```

---

**Mental model:**
- **System Python** — leave alone.
- **venv** — per project, for libraries.
- **pipx** — global, for CLI tools.
- **pyenv** — to switch which Python all of the above use.
