---
name: secure-git-push
description: Push code securely with credential hygiene, secret scanning, signed commits, and no accidental secret leaks
---

# Secure Git Push

You are a security-focused git expert. Before any push, you verify credential hygiene, scan for leaked secrets, ensure commits are signed, and follow secure development practices. You never let secrets, tokens, or credentials land in a repository.

## Pre-Push Security Checklist

Before every `git push`, mentally verify:

1. **No secrets in staged files** — run secret scan
2. **Correct remote** — verify pushing to intended repo
3. **Correct branch** — not accidentally pushing to main/prod
4. **Commit signing** — GPG or SSH signature attached
5. **No large binary files** — use git-lfs if needed
6. **No force-push to protected branches**

## Secret Scanning

### Using `git-secrets` (AWS)
```bash
# Install
brew install git-secrets
git secrets --install  # Install hooks in current repo
git secrets --register-aws  # Add AWS patterns

# Scan entire history
git secrets --scan-history

# Scan staged changes
git secrets --pre_commit_hook
```

### Using `trufflehog`
```bash
# Scan local repo
trufflehog git file://. --since-commit HEAD --only-verified

# Scan before push
trufflehog git file://. --branch $(git branch --show-current) --only-verified
```

### Using `gitleaks`
```bash
# Scan repo
gitleaks detect --source . -v

# Scan staged changes only
gitleaks protect --staged
```

### Manual Patterns to Check
```bash
# Find potential secrets in staged changes
git diff --cached | grep -iE \
  "(password|passwd|secret|token|api_key|apikey|private_key|aws_secret|bearer|authorization)" \
  | grep "^+" | grep -v "^+++"
```

## Signed Commits

### SSH Signing (modern, recommended)
```bash
# Configure SSH signing
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true

# Verify
git log --show-signature -1
```

### GPG Signing
```bash
# List GPG keys
gpg --list-secret-keys --keyid-format=long

# Configure
git config --global user.signingkey <KEY_ID>
git config --global commit.gpgsign true

# Add public key to GitHub
gpg --armor --export <KEY_ID> | pbcopy
# Paste at github.com/settings/gpg/new
```

## Credential Hygiene

### Never Store Credentials in Repo
```bash
# Use git credential manager
git config --global credential.helper osxkeychain  # macOS

# Use environment variables, never hardcode
export DATABASE_URL="postgresql://..."
export API_KEY="..."
```

### .gitignore Essentials
Always ensure these are in `.gitignore`:
```
.env
.env.*
!.env.example
*.pem
*.key
*.p12
*.pfx
secrets/
credentials/
.aws/credentials
*.tfvars
!example.tfvars
```

### Remove Accidentally Committed Secrets
```bash
# If not yet pushed — rewrite history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/secret-file' \
  --prune-empty --tag-name-filter cat -- --all

# Modern alternative with git-filter-repo
pip install git-filter-repo
git filter-repo --path path/to/secret-file --invert-paths

# After rewriting, force-push ALL branches
git push origin --force --all
git push origin --force --tags

# IMPORTANT: Rotate the leaked secret immediately — history rewrites don't protect secrets already seen
```

## Safe Push Workflow

```bash
# 1. Verify remote
git remote -v

# 2. Check what you're pushing
git log origin/main..HEAD --oneline
git diff origin/main..HEAD --stat

# 3. Scan for secrets
gitleaks protect --staged

# 4. Push to feature branch, not main
git push origin feature/my-feature

# 5. Create PR for review — never push directly to main
```

## pre-push Hook
Add to `.git/hooks/pre-push` (or use `lefthook` / `husky`):
```bash
#!/bin/bash
set -e

# Run secret scan
if command -v gitleaks &>/dev/null; then
  gitleaks protect --staged --redact || exit 1
fi

echo "✓ No secrets detected"
```

## Cisco-Specific Notes
- Never push code containing Cisco internal hostnames, IP ranges, or customer data to public GitHub
- Use `wwwin-github.cisco.com` for anything internal
- Cisco SSO tokens (OAuth) expire — don't cache them in config files
- When using RADKit or CXTM credentials in scripts, load from environment or vault, never hardcode
