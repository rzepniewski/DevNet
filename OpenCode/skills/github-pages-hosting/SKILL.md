---
name: github-pages-hosting
description: Host static sites and documentation on GitHub Pages with automated deployment workflows
---

# GitHub Pages Hosting

You are an expert at deploying static sites, documentation portals, and web apps to GitHub Pages. You know how to configure repositories, set up GitHub Actions deployment pipelines, and troubleshoot common Pages issues.

## Core Capabilities

### Repository Setup
- Enable GitHub Pages via repository Settings → Pages
- Configure source branch (typically `gh-pages` or `/docs` on `main`)
- Set up custom domains with CNAME records and DNS configuration
- Configure HTTPS enforcement

### Static Site Generators
You are proficient with deploying all major SSGs to GitHub Pages:
- **MkDocs** (`mkdocs gh-deploy` or GitHub Actions)
- **Jekyll** (native GitHub Pages support — no Actions required)
- **Sphinx** (Python docs → HTML → Pages)
- **VitePress / Docusaurus / Astro** (build → deploy via Actions)
- **Plain HTML/CSS/JS** (direct push to gh-pages branch)

### GitHub Actions Deployment Workflow
When asked to set up automated deployment, generate a `.github/workflows/deploy.yml` like:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Build
        run: <build command here>
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./site  # adjust to build output dir

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Custom Domain Configuration
1. Add `CNAME` file to repository root (or `/docs`) containing the domain: `docs.example.com`
2. In DNS provider: add CNAME record pointing to `<username>.github.io`
3. In GitHub repo Settings → Pages → Custom domain: enter domain
4. Check "Enforce HTTPS" once certificate provisioned

### Cisco Internal GitHub (wwwin-github)
For Cisco internal repositories on `wwwin-github.cisco.com`:
- Use `github.cisco.com` Pages equivalent if available
- Enterprise GitHub Pages may require IT approval and specific domain configuration
- Prefer MkDocs + GitHub Actions for internal documentation portals

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| 404 on root | Missing `index.html` at site root | Ensure SSG outputs `index.html` |
| Build fails | Wrong Node/Python version | Pin version in workflow with `setup-node@v4` |
| Custom domain resets | CNAME file missing in repo | Add CNAME file to source branch |
| Mixed content warnings | HTTP assets on HTTPS page | Update all asset URLs to HTTPS |
| Large repo slow deploy | Binary files in git history | Use `.gitignore` or git-lfs |

## Best Practices
- Never commit build artifacts to `main` — use `gh-pages` branch or GitHub Actions artifacts
- Use `actions/cache` to speed up dependency installs in CI
- Set `baseURL` / `base` in SSG config to match the Pages URL path (`/<repo-name>/`)
- For project sites (not user/org sites), the URL is `https://<user>.github.io/<repo>/` — configure your SSG accordingly
