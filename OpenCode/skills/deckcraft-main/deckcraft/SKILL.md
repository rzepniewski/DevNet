---
name: deckcraft
description: Use when creating offline HTML slide presentations with glassmorphism design. Use when user asks to create a presentation, pitch deck, slide deck, quarterly review, or visualize information as slides.
---

# DeckCraft Presentation Framework

Create self-contained HTML presentations optimized for AI workflows.

## Workflow

### 1. Set Up Presentation Directory

Create a presentation directory with a slides folder:

```bash
mkdir -p my-presentation/slides
```

### 2. Create config.json

```json
{
  "title": "Presentation Title",
  "defaultTheme": "purple",
  "defaultProfile": "tech",
  "sections": ["intro", "problem", "solution", "conclusion"],
  "output": { "dir": "output", "filename": "presentation.html" }
}
```

**Themes:** mesh, purple, cyan, emerald, orange, rose, blue, dark, cisco, light, warm, cool

**Profiles:**
| Profile | Use For |
|---------|---------|
| tech | Startups, dev conferences, product launches |
| corporate | Business reviews, investor pitches |
| academic | Research, lectures, conferences |
| creative | Portfolios, design pitches, agency work |

### 3. Create Slides

Each slide is a separate HTML file in `slides/` directory.

**Naming:** `01-slide-title.html`, `02-slide-problem.html`, etc.

**Using Templates (Optional):**
Copy and customize templates from `<skill>/assets/templates/`:
```bash
cp <skill>/assets/templates/title-slide.html slides/01-slide-title.html
cp <skill>/assets/templates/diagram-slide.html slides/02-slide-overview.html
```

Available templates: `title-slide.html`, `comparison-slide.html`, `diagram-slide.html`, `data-slide.html`, `quote-slide.html`

**Title slide:**
```html
<div class="slide title-slide" data-section="intro" data-order="1">
    <div class="slide-content">
        <h1>Presentation Title</h1>
        <div class="subtitle">Tagline or description</div>
        <div class="meta">
            <div class="meta-item">
                <i data-lucide="user"></i>
                <span>Author Name</span>
            </div>
        </div>
    </div>
</div>
```

**Content slide:**
```html
<div class="slide" data-section="problem" data-order="2">
    <div class="slide-content">
        <span class="tag">Section Label</span>
        <h2>Slide Title</h2>
        <p>Content paragraph.</p>

        <!-- Add components here -->
    </div>
</div>
```

### 4. Build

Run from the directory containing your presentation folder:

```bash
cd /path/to/your/projects
<skill>/scripts/build.sh my-presentation
```

Or use an absolute path from anywhere:

```bash
<skill>/scripts/build.sh /path/to/your/projects/my-presentation
```

Output: `my-presentation/output/presentation.html` (single self-contained file)

### 5. Export (Optional)

Presentations can be exported to PDF or PowerPoint (PPTX) format for sharing.

**Only run export commands if the user explicitly requests PDF or PPTX output.**

**Prerequisites:** Node.js and npm must be installed. Dependencies auto-install on first use (stored in `<skill>/scripts/node_modules/` and reused across exports).

**Do NOT:**
- Run `npm install` manually — the export scripts handle this automatically
- Run `npm init` or `npm install` in presentation directories

**PDF Export:**
```bash
node <skill>/scripts/export-pdf.js /path/to/my-presentation/output/presentation.html
node <skill>/scripts/export-pdf.js /path/to/my-presentation/output/presentation.html -o my-deck.pdf --page-numbers
```

**PowerPoint Export:**
```bash
node <skill>/scripts/export-pptx.js /path/to/my-presentation/output/presentation.html
node <skill>/scripts/export-pptx.js /path/to/my-presentation/output/presentation.html -o my-deck.pptx --theme dark
```

**Options:**
| Option | Description |
|--------|-------------|
| `--output, -o` | Custom output path |
| `--width` | Viewport width (default: 1920) |
| `--height` | Viewport height (default: 1080) |
| `--theme` | Override presentation theme |
| `--page-numbers` | Add page numbers (PDF only) |

**Note:** Both exports render slides as images to preserve glassmorphism effects. Recipients can view and present but not edit slide content.

## Component Quick Reference

### Cards
```html
<div class="cards-grid">
    <div class="card">
        <h4>Title</h4>
        <p>Description</p>
    </div>
</div>
```

### Stats
```html
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-value">99%</div>
        <div class="stat-label">Metric</div>
        <div class="stat-trend up">↑ 5%</div>
    </div>
</div>
```

### Flow Diagram
```html
<div class="diagram">
    <div class="flow-diagram">
        <div class="flow-box"><h4>Step 1</h4></div>
        <span class="flow-arrow">&rarr;</span>
        <div class="flow-box highlight"><h4>Step 2</h4></div>
    </div>
</div>
```

### Two Columns
```html
<div class="two-col">
    <div><h3>Left</h3><p>Content</p></div>
    <div><h3>Right</h3><p>Content</p></div>
</div>
```

### Table
```html
<div class="table-container">
    <table>
        <thead><tr><th>Header</th></tr></thead>
        <tbody><tr><td>Data</td></tr></tbody>
    </table>
</div>
```

### Terminal
```html
<div class="terminal">
    <div class="terminal-header">
        <span class="terminal-dot red"></span>
        <span class="terminal-dot yellow"></span>
        <span class="terminal-dot green"></span>
        <span class="terminal-title">Terminal</span>
    </div>
    <div class="terminal-body">
        <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-command">npm install</span>
        </div>
        <div class="terminal-line success">
            <span class="terminal-output">Done!</span>
        </div>
    </div>
</div>
```

### Timeline
```html
<div class="timeline">
    <div class="timeline-item completed">
        <div class="timeline-marker"></div>
        <div class="timeline-content"><h4>Q1</h4><p>Done</p></div>
    </div>
    <div class="timeline-item active">
        <div class="timeline-marker"></div>
        <div class="timeline-content"><h4>Q2</h4><p>Current</p></div>
    </div>
</div>
```

### Quote
```html
<div class="quote-block">
    <div class="quote-text">"Quote text here."</div>
    <div class="quote-attribution">
        <span class="quote-author">Name</span>
        <span class="quote-title">Title</span>
    </div>
</div>
```

### Highlight Box
```html
<div class="highlight-box">
    <p>Key takeaway or important note.</p>
</div>
```

### Title Modifiers

Apply to `h2`: `.title-xl`, `.title-gradient`, `.title-glow`, `.title-underline`

```html
<h2 class="title-gradient">Gradient Title</h2>
```

## References

**Read only the reference files you need for the components being used. Do not read all files upfront.**

| Need | Reference File |
|------|---------------|
| Slide structure, columns, headings, text | [references/layout-typography.md](references/layout-typography.md) |
| Cards, highlight boxes, diagram containers | [references/cards-highlights.md](references/cards-highlights.md) |
| Flow/process diagrams | [references/flow-diagrams.md](references/flow-diagrams.md) |
| Code blocks, terminal mockups | [references/code-terminal.md](references/code-terminal.md) |
| Stats, tables, lists | [references/data-display.md](references/data-display.md) |
| Timelines, roadmaps | [references/timeline.md](references/timeline.md) |
| SVG icons, icon grids (use instead of emojis) | [references/icons.md](references/icons.md) |
| Quotes, typing animation | [references/quotes-media.md](references/quotes-media.md) |
| Theme details, Cisco theme | [references/themes.md](references/themes.md) |
| Style profiles (tech, corporate, academic, creative) | [references/profiles.md](references/profiles.md) |
| Full slide examples combining components | [references/complete-slides.md](references/complete-slides.md) |
| Fragment/build animations (incremental reveal) | [references/fragments.md](references/fragments.md) |
| Slide transitions (fade, slide, zoom) | [references/transitions.md](references/transitions.md) |
| Images, video embeds, background images | [references/images-video.md](references/images-video.md) |
| Charts (bar, donut, progress ring) | [references/charts.md](references/charts.md) |
| Animated flow diagrams | [references/animated-diagrams.md](references/animated-diagrams.md) |
| Tabbed content within slides | [references/tabs.md](references/tabs.md) |
| Math equations and formulas | [references/math.md](references/math.md) |
| Print-friendly handouts | [references/print.md](references/print.md) |

### 6. Custom CSS (Optional)

Override or extend framework styles without modifying core files. Create a `styles/` directory in your presentation:

```
my-presentation/
  config.json
  slides/
  styles/           ← optional
    custom.css      ← loaded after all framework CSS
```

**Auto-discovery:** Any `*.css` files in `styles/` are included automatically.

**Explicit control via config.json:**
```json
{
  "title": "My Presentation",
  "customCSS": ["styles/custom.css", "styles/brand.css"]
}
```

**What you can do with custom CSS:**
- Override CSS variables for the whole presentation
- Override component styles for specific themes
- Add new component classes
- Define a custom theme (`.theme-brand .slide { ... }`)
- Override accent colors per-theme

Custom CSS loads after all framework CSS but before the print stylesheet.

## Assets

- **assets/lib/core/** - Modular CSS framework files (15 files, loaded in order by build.sh)
- **assets/lib/** - JS framework files, extension CSS (prism, math, components-extra, print)
- **assets/lib/profiles/** - Style profile CSS (tech, corporate, academic, creative)
- **assets/templates/** - Slide template files (title, comparison, diagram, data, quote)
- **scripts/build.sh** - Build script (run with presentation path as argument)
- **scripts/export-pdf.js** - PDF export script
- **scripts/export-pptx.js** - PowerPoint export script

## CRITICAL: No Emojis

**NEVER use emojis in slides.** Use Lucide icons (`<i data-lucide="icon-name">`) instead for visual elements. Use pictorial representations (diagrams, flow charts, icon grids, cards with icons) wherever possible to make slides visually engaging without emojis.

**Icons always get vivid colored backgrounds.** In icon grids and card grids, each `.icon-wrapper` automatically receives a saturated gradient background from the theme's accent colors with white icons on top. Use `.icon-accent-1` through `.icon-accent-4` on `.icon-wrapper` to manually pick a specific accent color.

## CRITICAL: Vary Slides to Avoid Monotony

**Every slide must feel visually distinct**, even within the same theme. The framework helps by automatically cycling glow colors and icon accents per slide (`nth-child` rotation), but you must also vary the content layout:

- **Alternate component types** across slides — don't use cards on every slide. Mix cards, icon grids, stats grids, flow diagrams, comparison tables, highlight boxes, timelines, and quote blocks.
- **Vary icon choices** — pick different, contextually relevant Lucide icons per slide rather than reusing the same ones.
- **Mix content density** — follow a content-heavy slide (cards, stats) with a lighter one (quote, single highlight box, large icon grid).
- **Use different section tags** — vary the `<span class="tag">` labels to create visual rhythm.
- **Leverage the glow system** — each slide automatically gets a different glow edge color combination cycling through the theme's accents, so slides naturally look different when viewed in sequence.

## Tips

1. One main idea per slide
2. Match profile to audience
3. Use `data-section` for navigation grouping
4. Use `data-order` for slide sequence
5. Cards for features, stats for metrics, flow for processes
6. Use `<i data-lucide="icon-name">` for icons — browse all at [lucide.dev/icons](https://lucide.dev/icons)
7. Icons in grids/cards automatically get colored backgrounds — no extra classes needed
8. Alternate between different component types across slides to keep the deck visually dynamic
