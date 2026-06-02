# Cards & Containers

## `.cards-grid` + `.card`

Auto-responsive grid of glassmorphism cards.

```html
<div class="cards-grid">
  <div class="card">
    <h4>Feature One</h4>
    <p>Description of the feature and its benefits.</p>
  </div>
  <div class="card">
    <h4>Feature Two</h4>
    <p>Another feature description here.</p>
  </div>
  <div class="card">
    <h4>Feature Three</h4>
    <p>Third feature with details.</p>
  </div>
</div>
```

| Class | Description |
|-------|-------------|
| `.cards-grid` | Auto-fit grid (min 320px per card) |
| `.card` | Glassmorphism card with hover effect |

**Card Properties:**
- Background: 10% white with backdrop blur
- Border radius: 16px
- Hover: lifts up, darkens background

Use for feature lists, benefit grids, comparison items.

---

## `.diagram`

Container for diagrams and flow charts with enhanced styling.

```html
<div class="diagram">
  <div class="flow-diagram">
    <!-- flow content -->
  </div>
</div>
```

- Background: 10% white with blur, border radius: 20px, padding: 2.5rem

Wrap flow diagrams or visual content for visual separation.

---

## `.highlight-box`

Emphasized content with left border accent.

```html
<div class="highlight-box">
  <p>This is an important key takeaway or summary point.</p>
</div>
```

- 4px solid white left border, background: 10% white, larger text (1.3rem)

Use for key takeaways, important notes, call-outs.

---

## Examples

### Three Feature Cards

```html
<div class="cards-grid">
    <div class="card">
        <h4>Lightning Fast</h4>
        <p>Zero dependencies means instant loading. No waiting for external resources or CDNs.</p>
    </div>
    <div class="card">
        <h4>Fully Offline</h4>
        <p>Works anywhere without internet. Present confidently in any environment.</p>
    </div>
    <div class="card">
        <h4>Customizable</h4>
        <p>Eleven themes and four style profiles. Mix and match for 44 unique combinations.</p>
    </div>
</div>
```

### Four Cards with Icons

```html
<div class="cards-grid">
    <div class="card">
        <div class="icon-wrapper" style="margin-bottom: 1rem;">
            <i data-lucide="layers"></i>
        </div>
        <h4>Modular Design</h4>
        <p>Components work independently. Use only what you need.</p>
    </div>
    <div class="card">
        <div class="icon-wrapper" style="margin-bottom: 1rem;">
            <i data-lucide="zap"></i>
        </div>
        <h4>Blazing Performance</h4>
        <p>Optimized CSS with zero JavaScript required for styling.</p>
    </div>
    <div class="card">
        <div class="icon-wrapper" style="margin-bottom: 1rem;">
            <i data-lucide="shield"></i>
        </div>
        <h4>Privacy First</h4>
        <p>No tracking, no analytics. Your presentations stay private.</p>
    </div>
    <div class="card">
        <div class="icon-wrapper" style="margin-bottom: 1rem;">
            <i data-lucide="chart-bar"></i>
        </div>
        <h4>Data Visualization</h4>
        <p>Built-in components for stats, charts, and metrics.</p>
    </div>
</div>
```

### Two Cards Comparison

```html
<div class="two-col">
    <div class="card">
        <h4>Free Tier</h4>
        <p>Perfect for individuals and small projects.</p>
        <ul>
            <li>Unlimited presentations</li>
            <li>All themes included</li>
            <li>Community support</li>
        </ul>
    </div>
    <div class="card">
        <h4>Pro Tier</h4>
        <p>For teams and professional use.</p>
        <ul>
            <li>Custom branding</li>
            <li>Priority support</li>
            <li>Advanced analytics</li>
        </ul>
    </div>
</div>
```

### Key Takeaway

```html
<div class="highlight-box">
    <p>Key insight: Teams using DeckCraft report 40% faster presentation creation
    and zero technical failures during live presentations.</p>
</div>
```

### Important Note

```html
<div class="highlight-box">
    <p><strong>Important:</strong> All presentations are stored locally by default.
    Enable cloud sync in settings if you need cross-device access.</p>
</div>
```

### Numbered Steps (using cards)

```html
<div class="cards-grid">
    <div class="card">
        <h4>1. Install</h4>
        <p>Add DeckCraft to your project with npm or include directly via CDN.</p>
    </div>
    <div class="card">
        <h4>2. Configure</h4>
        <p>Choose your theme and style profile. Customize colors if needed.</p>
    </div>
    <div class="card">
        <h4>3. Create</h4>
        <p>Write your slides using simple HTML and our component classes.</p>
    </div>
    <div class="card">
        <h4>4. Present</h4>
        <p>Open in any browser and start presenting. No server required.</p>
    </div>
</div>
```
