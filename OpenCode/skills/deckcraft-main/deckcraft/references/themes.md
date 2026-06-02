# Themes

Apply to `<body>` element:

```html
<body class="theme-mesh">
<body class="theme-purple">
<body class="theme-cyan">
<body class="theme-emerald">
<body class="theme-orange">
<body class="theme-rose">
<body class="theme-blue">
<body class="theme-dark">
<body class="theme-light">
<body class="theme-warm">
<body class="theme-cool">
<body class="theme-cisco">
```

| Theme | Description |
|-------|-------------|
| `theme-mesh` | Multi-color gradient (default) |
| `theme-purple` | Purple gradient |
| `theme-cyan` | Cyan/teal gradient |
| `theme-emerald` | Green gradient |
| `theme-orange` | Orange/amber gradient |
| `theme-rose` | Pink/rose gradient |
| `theme-blue` | Blue gradient |
| `theme-dark` | Dark gray gradient |
| `theme-light` | Clean white/light gray (dark text) |
| `theme-warm` | Warm off-white/cream (dark text) |
| `theme-cool` | Cool white with blue tint (dark text) |
| `theme-cisco` | Cisco dark navy with high-gloss colorful gradient glows (per-slide-type) |

---

## Cisco Theme Details

The Cisco theme is unique — it applies **different gradient glow backgrounds per slide type** using CSS `:has()` selectors. No slide is ever plain dark navy; every component type gets its own glow treatment.

**Brand Colors:**

| Color | Hex | Usage |
|-------|-----|-------|
| Navy (base) | `#060e18` / `#0c1a2b` / `#081422` | Slide backgrounds |
| Cisco Blue | `#049fd9` | Accents, borders, highlights |
| Cisco Cyan | `#00bceb` | Glow effects, gradients |
| Cisco Orange | `#e8722a` | Warm glow accents |
| Cisco Pink | `#d94a8c` | Warm glow accents |

**5 Glow Types (auto-applied by slide content):**

| Glow | Position | Colors | Applied To |
|------|----------|--------|------------|
| Warm top-right | Top-right corner | Orange + pink + blue | `.title-slide` |
| Cyan right | Right edge | Cyan + blue | `.diagram`, `.table-container`, `.terminal` |
| Teal bottom-center | Bottom center | Blue + teal | `.highlight-box`, `.timeline` (base fallback) |
| Warm bottom | Bottom center | Orange + pink + blue | `.quote-block`, `.stats-grid` |
| Blue left | Left edge | Blue + indigo | `.two-col`, `.cards-grid` |

**Component Overrides:**

```html
<!-- Gradient title: white-to-cyan instead of purple-to-cyan -->
<h2 class="title-gradient">Cisco Blue Gradient</h2>

<!-- Glow title: white + Cisco blue glow -->
<h2 class="title-glow">Cisco Glow Title</h2>

<!-- Underline: orange -> pink -> blue gradient bar -->
<h2 class="title-underline">Cisco Underline</h2>
```

| Override | Effect |
|----------|--------|
| `h2.title-gradient` | White -> Cisco Blue -> Cyan gradient text |
| `h2.title-glow` | White + Cisco Blue + Cyan text shadow |
| `h2.title-underline::after` | Orange -> Pink -> Blue gradient underline |
| `.quote-block::before` | Teal-tinted quote mark (`rgba(0, 188, 235, 0.15)`) |
| `.highlight-box` | Cisco Blue left border (`#049fd9`) |
| `.flow-box.highlight` | Cisco Blue border + blue glow shadow |

**Recommended Profile:** `corporate` — pairs well with the professional Cisco aesthetic.

---

## Cisco Theme Examples

### Cisco Title Slide (Warm Top-Right Glow)

```html
<div class="slide title-slide" data-section="cover" data-order="1">
    <div class="slide-content">
        <h1>Network Architecture</h1>
        <div class="subtitle">Securing the modern enterprise with intent-based networking and zero-trust principles.</div>
        <div class="meta">
            <div class="meta-item">
                <i data-lucide="user"></i>
                <span>Infrastructure Team</span>
            </div>
        </div>
    </div>
</div>
```

### Cisco Cards Slide (Blue Left Glow)

```html
<div class="slide" data-section="content" data-order="2">
    <div class="slide-content">
        <span class="tag">Platform Capabilities</span>
        <h2 class="title-gradient">Core Pillars</h2>
        <div class="cards-grid">
            <div class="card">
                <h4>Secure Access</h4>
                <p>Zero-trust architecture with identity-based microsegmentation across campus and branch.</p>
            </div>
            <div class="card">
                <h4>SD-WAN</h4>
                <p>Application-aware routing with real-time path optimization and cloud onramp.</p>
            </div>
            <div class="card">
                <h4>Observability</h4>
                <p>Full-stack visibility from endpoint to application with ThousandEyes and AppDynamics.</p>
            </div>
        </div>
    </div>
</div>
```

### Cisco Two-Column Slide (Blue Left Glow)

```html
<div class="slide" data-section="content" data-order="3">
    <div class="slide-content">
        <span class="tag">Comparison</span>
        <h2>Traditional vs. Intent-Based</h2>
        <div class="two-col">
            <div>
                <h3>Legacy</h3>
                <ul>
                    <li>Manual CLI configuration</li>
                    <li>Box-by-box management</li>
                    <li>Reactive troubleshooting</li>
                </ul>
            </div>
            <div>
                <h3>Intent-Based</h3>
                <ul>
                    <li>Policy-driven automation</li>
                    <li>Centralized controller</li>
                    <li>AI-driven insights</li>
                </ul>
            </div>
        </div>
    </div>
</div>
```

### Cisco Stats Slide (Warm Bottom Glow)

```html
<div class="slide" data-section="data" data-order="4">
    <div class="slide-content">
        <span class="tag">By The Numbers</span>
        <h2 class="title-gradient">Network Impact</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">
                    <span class="stat-trend down">&darr;</span>
                    73%
                </div>
                <div class="stat-label">Mean Time to Resolve</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">99.99%</div>
                <div class="stat-label">Uptime SLA</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">
                    <span class="stat-trend up">&uarr;</span>
                    4x
                </div>
                <div class="stat-label">Deployment Speed</div>
            </div>
        </div>
    </div>
</div>
```

### Cisco Diagram Slide (Cyan Right Glow)

```html
<div class="slide" data-section="visuals" data-order="5">
    <div class="slide-content">
        <span class="tag">Architecture</span>
        <h2>Packet Flow</h2>
        <div class="diagram">
            <div class="flow-diagram">
                <div class="flow-box">
                    <h4>Endpoint</h4>
                    <p>ISE authentication</p>
                </div>
                <div class="flow-arrow">&rarr;</div>
                <div class="flow-box">
                    <h4>Access Layer</h4>
                    <p>Catalyst switching</p>
                </div>
                <div class="flow-arrow">&rarr;</div>
                <div class="flow-box highlight">
                    <h4>DNA Center</h4>
                    <p>Policy &amp; assurance</p>
                </div>
                <div class="flow-arrow">&rarr;</div>
                <div class="flow-box">
                    <h4>WAN Edge</h4>
                    <p>SD-WAN fabric</p>
                </div>
            </div>
        </div>
    </div>
</div>
```

### Cisco Statement Slide (Teal Bottom-Center Glow)

```html
<div class="slide" data-section="visuals" data-order="6">
    <div class="slide-content">
        <span class="tag">Key Insight</span>
        <h2 class="title-glow">The network sees everything</h2>
        <div class="highlight-box">
            <p>Every packet, every flow, every device. The network is the most powerful sensor and enforcer in your security architecture.</p>
        </div>
    </div>
</div>
```

### Cisco Quote Slide (Warm Bottom Glow)

```html
<div class="slide" data-section="visuals" data-order="7">
    <div class="slide-content">
        <span class="tag">Leadership</span>
        <div class="quote-block">
            <div class="quote-text">
                "The bridge to possible starts with connection. When we connect everything, we make anything possible."
            </div>
            <div class="quote-attribution">
                <span class="quote-author">Chuck Robbins</span>
                <span class="quote-title">Chair &amp; CEO, Cisco</span>
            </div>
        </div>
    </div>
</div>
```

---

## Custom Theme Overrides

Use the `styles/custom.css` convention to override or extend theme styles without modifying framework files.

### Override CSS Variables

```css
/* styles/custom.css - Override accent colors for all themes */
:root {
    --accent-1-rgb: 255, 100, 50;   /* custom orange */
    --accent-2-rgb: 50, 200, 150;   /* custom teal */
}
```

### Override Specific Theme Styles

```css
/* styles/custom.css - Custom background for purple theme */
.theme-purple .slide {
    background: linear-gradient(135deg, #1a0533 0%, #3d1b6e 50%, #7c3aed 100%);
}
```

### Define a Custom Theme

```css
/* styles/custom.css - Brand theme */
.theme-brand .slide {
    background: linear-gradient(135deg, #001a33 0%, #003366 50%, #004c99 100%);
}

.theme-brand {
    --accent-1-rgb: 0, 102, 204;
    --accent-2-rgb: 0, 153, 255;
    --accent-3-rgb: 51, 187, 255;
    --accent-4-rgb: 102, 204, 255;
}

.theme-brand h2.title-gradient {
    background: linear-gradient(135deg, #ffffff 0%, #0066cc 50%, #0099ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

### Override Per-Theme Accent Colors

```css
/* styles/custom.css - Custom accents for the cisco theme */
.theme-cisco {
    --accent-1-rgb: 0, 200, 255;
    --accent-2-rgb: 255, 120, 50;
    --accent-3-rgb: 220, 80, 150;
    --accent-4-rgb: 100, 200, 100;
}
```

### Setup

1. Create `styles/` directory in your presentation folder
2. Add `custom.css` (or any `*.css` files)
3. Build normally — custom CSS is auto-discovered
4. Or specify explicitly in config.json: `"customCSS": ["styles/custom.css"]`

Custom CSS loads after all framework CSS, so your rules override framework defaults by specificity or source order.

---

### Cisco Terminal Slide (Cyan Right Glow)

```html
<div class="slide" data-section="visuals" data-order="8">
    <div class="slide-content">
        <span class="tag">CLI Demo</span>
        <h2>Device Configuration</h2>
        <div class="terminal">
            <div class="terminal-header">
                <span class="terminal-dot red"></span>
                <span class="terminal-dot yellow"></span>
                <span class="terminal-dot green"></span>
                <span class="terminal-title">catalyst-9300#</span>
            </div>
            <div class="terminal-body">
                <div class="terminal-line">
                    <span class="terminal-prompt">#</span>
                    <span class="terminal-command">show running-config | include interface</span>
                </div>
                <div class="terminal-line">
                    <span class="terminal-output">interface GigabitEthernet1/0/1</span>
                </div>
                <div class="terminal-line success">
                    <span class="terminal-output">interface GigabitEthernet1/0/2</span>
                </div>
            </div>
        </div>
    </div>
</div>
```
