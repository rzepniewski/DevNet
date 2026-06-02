# Layout & Typography

## Slide Structure

### `.slide`

The fundamental slide container. Each slide is a full-viewport element.

```html
<div class="slide">
  <div class="slide-content">
    <!-- slide content here -->
  </div>
</div>
```

| Class | Description |
|-------|-------------|
| `.slide` | Base slide container (position: absolute, full viewport) |
| `.slide.active` | Currently visible slide (opacity: 1, visible) |

Every presentation slide must be wrapped in `.slide`. The JavaScript controller manages the `.active` class.

---

### `.slide-content`

Inner content wrapper with max-width constraint and centering.

```html
<div class="slide">
  <div class="slide-content">
    <h2>Slide Title</h2>
    <p>Content goes here</p>
  </div>
</div>
```

**Properties:**
- Max width: 1400px
- Full height flex column
- Vertically centered content

Always wrap slide content in `.slide-content` for consistent spacing and alignment.

---

### `.title-slide`

Special styling for opening/section title slides with centered text.

```html
<div class="slide title-slide">
  <div class="slide-content">
    <h1>Presentation Title</h1>
    <p class="subtitle">A compelling subtitle</p>
    <div class="meta">
      <div class="meta-item">
        <i data-lucide="user"></i>
        <span>Author Name</span>
      </div>
      <div class="meta-item">
        <i data-lucide="calendar"></i>
        <span>Date</span>
      </div>
    </div>
  </div>
</div>
```

| Class | Description |
|-------|-------------|
| `.title-slide` | Centers text, applies title slide styling |
| `.subtitle` | Large subtitle text (1.8rem, 80% white) |
| `.meta` | Flex container for metadata items (gap: 3rem) |
| `.meta-item` | Icon + text metadata (author, date, etc.) |

Use for first slide of presentation or section openers.

---

### `.two-col`

Two-column grid layout for side-by-side content.

```html
<div class="two-col">
  <div>
    <h3>Left Column</h3>
    <p>Content for the left side</p>
  </div>
  <div>
    <h3>Right Column</h3>
    <p>Content for the right side</p>
  </div>
</div>
```

**Properties:**
- Equal-width columns (1fr 1fr)
- Gap: 2rem
- Collapses to single column below 1200px

Use for comparing two concepts, text + visual, or balanced content pairs.

---

## Typography

### Headings

```html
<h1>Title Slide Heading</h1>
<h2>Slide Title</h2>
<h3>Section Header</h3>
<h4>Card/Component Header</h4>
```

| Element | Size | Weight | Use Case |
|---------|------|--------|----------|
| `h1` | 5rem | 900 | Title slides only |
| `h2` | 3.5rem | 800 | Main slide titles |
| `h3` | 1.8rem | 600 | Section headers within slides |
| `h4` | 1.3rem | 700 | Card headers, uppercase |

---

### Title Modifiers

Apply to `h2` elements for visual emphasis.

```html
<h2 class="title-xl">Extra Large Title</h2>
<h2 class="title-gradient">Gradient Text</h2>
<h2 class="title-glow">Glowing Title</h2>
<h2 class="title-underline">Underlined Title</h2>

<!-- Combined -->
<h2 class="title-xl title-gradient">Large Gradient</h2>
<h2 class="title-xl title-glow">Large Glowing</h2>
```

| Class | Effect |
|-------|--------|
| `.title-xl` | Larger size (4.5rem) |
| `.title-gradient` | Purple to cyan gradient text |
| `.title-glow` | Multi-color glow shadow |
| `.title-underline` | Animated gradient underline |

**Title with Badge:**

```html
<div class="title-badge-wrap">
  <span class="tag">Section Name</span>
  <h2>Slide Title</h2>
</div>
```

---

### Body Text

```html
<p>Standard body text with comfortable reading size.</p>
```

- Size: 1.35rem, Line height: 1.7, Color: 80% white

---

### `.subtitle`

Large subtitle for title slides.

```html
<p class="subtitle">A compelling tagline or description</p>
```

- Size: 1.8rem, Color: 80% white, Margin bottom: 3rem

Use on title slides below the main h1.

---

### `.tag`

Section label or category indicator.

```html
<span class="tag">AI Marketplace</span>
<span class="tag">Phase 1</span>
```

- Uppercase, small text (0.85rem), semi-transparent background, border with 30% white

Use above slide titles to indicate section/category.

---

## Layout Examples

### Comparison Layout

```html
<div class="two-col">
    <div>
        <h3>Before</h3>
        <ul>
            <li>Manual slide creation</li>
            <li>Inconsistent styling</li>
            <li>Heavy file sizes</li>
            <li>Internet required</li>
        </ul>
    </div>
    <div>
        <h3>After</h3>
        <ul>
            <li>Template-based workflow</li>
            <li>Unified design system</li>
            <li>Lightweight HTML output</li>
            <li>Fully offline capable</li>
        </ul>
    </div>
</div>
```

### Content with Diagram

```html
<div class="two-col">
    <div>
        <h3>How It Works</h3>
        <p>DeckCraft uses a simple, declarative approach to building presentations.</p>
        <ul>
            <li>Write content in HTML or Markdown</li>
            <li>Apply themes with a single class</li>
            <li>Build once, present anywhere</li>
        </ul>
    </div>
    <div>
        <div class="terminal">
            <div class="terminal-header">
                <span class="terminal-dot red"></span>
                <span class="terminal-dot yellow"></span>
                <span class="terminal-dot green"></span>
                <span class="terminal-title">build</span>
            </div>
            <div class="terminal-body">
                <div class="terminal-line">
                    <span class="terminal-prompt">$</span>
                    <span class="terminal-command">deckcraft build</span>
                </div>
                <div class="terminal-line success">
                    <span class="terminal-output">Built presentation.html</span>
                </div>
            </div>
        </div>
    </div>
</div>
```
