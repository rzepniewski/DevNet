---
name: github-repo-management
description: Create, configure, and manage GitHub repositories including branch protection, teams, and settings
---

# GitHub Repository Management

You are an expert GitHub administrator. You help create and configure repositories with proper settings, branch protection rules, team access, and governance policies using the GitHub CLI (`gh`) and REST API.

## Core Operations

### Create a Repository
```bash
# Public repo
gh repo create <name> --public --description "Description" --clone

# Private repo with README
gh repo create <name> --private --add-readme --gitignore Node --license MIT

# From existing local directory
gh repo create <name> --private --source=. --remote=origin --push
```

### Clone and Configure
```bash
gh repo clone <owner>/<repo>
gh repo view <owner>/<repo> --web   # Open in browser
gh repo edit <owner>/<repo> --description "New desc" --homepage "https://..."
```

### Branch Protection Rules
Configure via GitHub API or UI. Recommended settings for `main`:
```bash
gh api repos/<owner>/<repo>/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci/build"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

Key protection options:
- `required_approving_review_count`: Minimum PR approvals (1-6)
- `dismiss_stale_reviews`: Re-request review on new commits
- `require_code_owner_reviews`: Require CODEOWNERS approval
- `required_status_checks`: CI must pass before merge
- `enforce_admins`: Apply rules to admins too

### Teams and Collaborators
```bash
# Add collaborator with role
gh api repos/<owner>/<repo>/collaborators/<username> \
  --method PUT --field permission=write

# List collaborators
gh api repos/<owner>/<repo>/collaborators

# Add team to repo (org repos only)
gh api orgs/<org>/teams/<team-slug>/repos/<owner>/<repo> \
  --method PUT --field permission=push
```

### Repository Settings
```bash
# Disable wiki, issues; enable projects
gh repo edit <owner>/<repo> \
  --enable-wiki=false \
  --enable-issues=true \
  --enable-projects=true \
  --default-branch main

# Set merge strategies
gh api repos/<owner>/<repo> --method PATCH \
  --field allow_squash_merge=true \
  --field allow_merge_commit=false \
  --field allow_rebase_merge=true \
  --field delete_branch_on_merge=true
```

### Secrets and Variables
```bash
# Repository secret
gh secret set MY_SECRET --body "value"
gh secret set MY_SECRET < secret_file.txt

# Environment secret
gh secret set MY_SECRET --env production --body "value"

# Repository variable
gh variable set MY_VAR --body "value"
```

### CODEOWNERS
Create `.github/CODEOWNERS`:
```
# Global owner
* @org/team-name

# Specific paths
/docs/          @org/docs-team
*.tf            @org/infrastructure
src/security/   @security-lead @backup-lead
```

### Repository Templates
```bash
# Create template from existing repo
gh api repos/<owner>/<repo> --method PATCH --field is_template=true

# Create new repo from template
gh repo create new-repo --template <owner>/<template-repo> --private
```

## Cisco Enterprise GitHub (wwwin-github.cisco.com)

For Cisco internal GitHub, set `GH_HOST`:
```bash
export GH_HOST=wwwin-github.cisco.com
gh auth login --hostname wwwin-github.cisco.com
gh repo create <org>/<repo> --private
```

## Webhooks
```bash
gh api repos/<owner>/<repo>/hooks --method POST \
  --field name=web \
  --field active=true \
  --field 'events[]=push' \
  --field 'events[]=pull_request' \
  --field 'config[url]=https://example.com/webhook' \
  --field 'config[content_type]=json'
```

## Best Practices
- Always set `delete_branch_on_merge=true` to keep branch list clean
- Use CODEOWNERS for critical paths (infrastructure, security)
- Require at least 1 PR review for shared repos
- Pin Actions to commit SHAs in workflows for supply chain security
- Use environments for production deployments with required reviewers
