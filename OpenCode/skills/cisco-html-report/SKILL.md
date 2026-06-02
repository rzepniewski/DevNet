---
name: cisco-html-report
description: Generate professional, Cisco-branded HTML reports from data, test results, or analysis
---

# Cisco HTML Report Skill

You generate beautiful, professional, self-contained HTML reports styled with Cisco branding.

## When to Use

Load this skill when the user asks you to:
- Generate a report from test results, data, or analysis
- Create a readable summary document
- Produce a shareable, standalone HTML file
- Visualize data in a professional format

## Report Structure

Every report MUST include:

1. **Header** — Cisco logo placeholder, report title, date, author
2. **Executive Summary** — 2–4 bullet points of top findings
3. **Main Content** — structured sections with clear headings
4. **Appendices** (if needed) — raw data, tables, configuration details
5. **Footer** — document metadata, classification level, version

## HTML Template Standards

### Head Section
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Title — Cisco</title>
  <style>
    /* All styles must be inline/embedded — no external dependencies */
  </style>
</head>
```

### Cisco Color Variables
```css
:root {
  --cisco-blue: #00BCEB;
  --cisco-dark: #003359;
  --cisco-gray: #6B6B6B;
  --cisco-light: #F5F5F5;
  --success: #6DBE4E;
  --warning: #FFA500;
  --danger: #E2231A;
}
```

### Typography
- Font stack: `'CiscoSans', 'Helvetica Neue', Arial, sans-serif`
- Base size: 14px or 16px
- Headings: Use `--cisco-dark` color
- Body text: Use `--cisco-gray` or `#333`

## Status Indicators

Use consistent status badges:
- ✅ PASS / Success — green (#6DBE4E)
- ⚠️ WARNING — amber (#FFA500)
- ❌ FAIL / Error — red (#E2231A)
- ℹ️ INFO / Neutral — Cisco Blue (#00BCEB)

## Data Tables

All tables must:
- Have a striped row style (alternating `#fff` and `#F5F5F5`)
- Have a sticky header row with `--cisco-dark` background and white text
- Include hover highlighting on rows
- Be horizontally scrollable on small viewports

## Charts & Visualizations

Use inline SVG or Chart.js (CDN-free, embedded) for:
- Pass/fail pie charts
- Timeline bar charts
- Coverage metrics

## Self-Contained Requirement

**CRITICAL**: The output HTML file must be completely self-contained:
- No external CSS links
- No external JS CDN links (embed scripts inline if needed)
- No external font imports (use system font stack)
- All images must be base64 encoded or SVG inline

## Output

Save the report to a `.html` file. Default filename: `report-YYYY-MM-DD.html`
Inform the user of the file path after saving.
