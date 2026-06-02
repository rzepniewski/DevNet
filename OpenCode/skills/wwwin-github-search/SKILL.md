---
name: wwwin-github-search
description: Search and navigate Cisco's internal GitHub Enterprise at wwwin-github.cisco.com
---

# Cisco Internal GitHub Search (wwwin-github)

You are an expert at searching and navigating Cisco's internal GitHub Enterprise instance at `wwwin-github.cisco.com`. You help find code, repositories, teams, and documentation within Cisco's internal developer ecosystem.

## Authentication Setup

```bash
# Authenticate with Cisco GitHub Enterprise
gh auth login --hostname wwwin-github.cisco.com

# Or set via environment
export GH_HOST=wwwin-github.cisco.com
export GH_TOKEN=<your-cisco-github-pat>

# Verify auth
gh auth status --hostname wwwin-github.cisco.com
```

## Searching Code

### Global Code Search
```bash
# Search code across all orgs
gh search code "<query>" --hostname wwwin-github.cisco.com

# Search in specific org
gh search code "<query>" --owner <org-name>

# Search by file extension
gh search code "<query>" --extension py --hostname wwwin-github.cisco.com

# Search in specific repo
gh search code "<query>" --repo <org>/<repo>
```

### REST API Code Search
```bash
GH_HOST=wwwin-github.cisco.com gh api \
  "search/code?q=<query>+org:<org-name>&per_page=30" \
  --jq '.items[] | {repo: .repository.full_name, file: .path, url: .html_url}'
```

## Searching Repositories

```bash
# Find repos by name
gh search repos "<name>" --hostname wwwin-github.cisco.com --limit 20

# Find repos in org
gh repo list <org-name> --limit 100 --hostname wwwin-github.cisco.com

# Search repos by topic
GH_HOST=wwwin-github.cisco.com gh api \
  "search/repositories?q=topic:<topic>+org:<org>" \
  --jq '.items[] | {name: .full_name, description: .description, url: .html_url}'
```

## Navigating Organizations

```bash
# List all orgs (if permitted)
GH_HOST=wwwin-github.cisco.com gh api user/orgs --jq '.[].login'

# List teams in org
GH_HOST=wwwin-github.cisco.com gh api orgs/<org>/teams --jq '.[].name'

# List repos in team
GH_HOST=wwwin-github.cisco.com gh api orgs/<org>/teams/<team-slug>/repos \
  --jq '.[].full_name'
```

## Common Cisco GitHub Orgs
Well-known internal GitHub orgs to search:
- `CiscoDevNet` — Developer tools and public-facing samples (also on github.com)
- `cisco-cx` — Customer Experience / TAC tools
- `cisco-radkit` — RADKit internal development
- `cisco-catalyst-center` — DNA Center / Catalyst Center automation
- `cisco-cxtm` — CXTM test management
- `cisco-cts` — Customer Technology Solutions

## Finding PRs and Issues

```bash
# Search open PRs assigned to you
gh pr list --assignee @me --hostname wwwin-github.cisco.com

# Search issues with label
gh search issues --label "bug" --hostname wwwin-github.cisco.com --org <org>

# Find PRs mentioning a topic
GH_HOST=wwwin-github.cisco.com gh search prs "<keyword>" --state open
```

## Cloning Internal Repos

```bash
# Clone via HTTPS (uses stored credentials)
git clone https://wwwin-github.cisco.com/<org>/<repo>.git

# Or via gh CLI
GH_HOST=wwwin-github.cisco.com gh repo clone <org>/<repo>
```

## Pro Tips

- **Rate limits**: Enterprise GitHub has higher rate limits than github.com, but API-heavy scripts should still implement backoff
- **SSO**: If you get 403 on API calls, your PAT may need SSO authorization — go to Settings → Personal access tokens → Enable SSO for Cisco org
- **Proxy**: Inside Cisco network, HTTPS proxies may be required (`HTTPS_PROXY=http://proxy.cisco.com:80`)
- **Search syntax**: Supports the same advanced search syntax as github.com: `language:python`, `size:>1000`, `pushed:>2024-01-01`
- **Forking**: Internal repos can be forked within wwwin-github — avoid pushing Cisco code to personal public GitHub

## Useful Aliases
```bash
alias ghc='GH_HOST=wwwin-github.cisco.com gh'
alias ghcs='GH_HOST=wwwin-github.cisco.com gh search code'
alias ghcr='GH_HOST=wwwin-github.cisco.com gh repo'
```
