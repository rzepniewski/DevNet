---
name: new-project
description: Scaffold a new engineering project with directory structure, git repo, README, and CI/CD boilerplate
---

# New Project Scaffolder

You scaffold new engineering projects from scratch with opinionated, production-ready structure. When this skill is loaded, you guide through project initialization end-to-end.

## Scaffolding Workflow

### Step 1: Gather Requirements
Ask these questions before generating anything:
1. **Language / stack** — Python, TypeScript, Go, etc.?
2. **Project type** — CLI tool, REST API, library, web app, data pipeline?
3. **Testing framework** — pytest, jest, go test, vitest?
4. **Deployment target** — Docker, Lambda, Kubernetes, bare metal?
5. **GitHub org** — wwwin-github or github.com?

### Step 2: Generate Directory Structure

**Python project:**
```
my-project/
├── src/my_project/
│   ├── __init__.py
│   └── main.py
├── tests/
│   ├── __init__.py
│   └── test_main.py
├── .github/workflows/ci.yml
├── pyproject.toml
├── Makefile
├── README.md
└── .gitignore
```

**TypeScript/Node project:**
```
my-project/
├── src/
│   └── index.ts
├── tests/
│   └── index.test.ts
├── .github/workflows/ci.yml
├── package.json
├── tsconfig.json
├── Makefile
├── README.md
└── .gitignore
```

**Go project:**
```
my-project/
├── cmd/my-project/
│   └── main.go
├── internal/
├── pkg/
├── .github/workflows/ci.yml
├── go.mod
├── Makefile
├── README.md
└── .gitignore
```

### Step 3: Standard Files

**Makefile (always include):**
```makefile
.PHONY: install test lint format build clean

install:
	# language-specific install command

test:
	# run tests with coverage

lint:
	# run linter

format:
	# run formatter

build:
	# build artifact

clean:
	# remove build artifacts
```

**README.md template:**
```markdown
# Project Name

> One-sentence description.

## Requirements
- [runtime version]

## Quick Start
```bash
make install
make test
```

## Usage
[brief usage example]

## Development
[how to run locally, contribute]
```

**GitHub Actions CI:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up [language]
        uses: actions/setup-[language]@v4
      - name: Install
        run: make install
      - name: Lint
        run: make lint
      - name: Test
        run: make test
```

### Step 4: Git Initialization
```bash
git init
git add .
git commit -m "chore: initial project scaffold"
```

### Step 5: Cisco-Specific Additions
- Add `CODEOWNERS` file pointing to team alias
- Add Cisco copyright header to all source files
- For internal projects: use `wwwin-github.cisco.com` remote
- For open-source: use `github.com` remote

## Behavior
- Generate ALL files in one pass — don't ask repeatedly
- Use opinionated defaults (Black for Python, Prettier for TS, gofmt for Go)
- Always include `.gitignore` appropriate for the stack
- Always include a `Makefile` with standard targets
- Suggest GitHub Actions CI from day one
