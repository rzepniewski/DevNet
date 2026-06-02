# Icons

Use **Lucide Icons** by name — no SVG paths to manage. Over 1,500 icons available. Browse the full set at [lucide.dev/icons](https://lucide.dev/icons).

## Quick Usage

Place an `<i>` tag with `data-lucide="icon-name"` anywhere. The framework replaces it with an SVG at build time.

```html
<i data-lucide="rocket"></i>
<i data-lucide="shield-check"></i>
<i data-lucide="chart-bar"></i>
```

Icons inherit color from their parent via `currentColor`. In icon grids and card grids, each icon automatically gets a **vivid colored background** that cycles through the theme's accent colors, with white icons on top.

---

## Icon Grid Component

### `.icon-grid` + `.icon-item`

Grid of icons with labels.

```html
<div class="icon-grid">
  <div class="icon-item">
    <div class="icon-wrapper">
      <i data-lucide="rocket"></i>
    </div>
    <span class="icon-label">Launch</span>
  </div>
  <div class="icon-item">
    <div class="icon-wrapper">
      <i data-lucide="shield-check"></i>
    </div>
    <span class="icon-label">Secure</span>
  </div>
  <div class="icon-item">
    <div class="icon-wrapper">
      <i data-lucide="zap"></i>
    </div>
    <span class="icon-label">Fast</span>
  </div>
  <div class="icon-item">
    <div class="icon-wrapper">
      <i data-lucide="globe"></i>
    </div>
    <span class="icon-label">Global</span>
  </div>
</div>
```

| Class | Description |
|-------|-------------|
| `.icon-grid` | Auto-fit grid (min 120px) |
| `.icon-grid.compact` | Smaller variant (min 100px, 56x56px wrapper) |
| `.icon-item` | Container with hover effect |
| `.icon-wrapper` | 80x80px rounded icon background |
| `.icon-wrapper.icon-lg` | 96x96px large variant for hero sections |
| `.icon-wrapper.icon-accent-1` | Vivid accent-1 gradient background, white icon |
| `.icon-wrapper.icon-accent-2` | Vivid accent-2 gradient background, white icon |
| `.icon-wrapper.icon-accent-3` | Vivid accent-3 gradient background, white icon |
| `.icon-wrapper.icon-accent-4` | Vivid accent-4 gradient background, white icon |
| `.icon-label` | Centered text label |

---

## Colored Icons

**Icon grids and card grids get vivid colored backgrounds by default** — each icon automatically cycles through the theme's accent colors with white icons. No extra classes needed.

To manually control which accent color an icon uses, add `.icon-accent-1` through `.icon-accent-4` to the `.icon-wrapper`.

```html
<div class="icon-grid">
    <div class="icon-item">
        <div class="icon-wrapper icon-accent-1">
            <i data-lucide="shield-check"></i>
        </div>
        <span class="icon-label">Security</span>
    </div>
    <div class="icon-item">
        <div class="icon-wrapper icon-accent-2">
            <i data-lucide="zap"></i>
        </div>
        <span class="icon-label">Speed</span>
    </div>
    <div class="icon-item">
        <div class="icon-wrapper icon-accent-3">
            <i data-lucide="globe"></i>
        </div>
        <span class="icon-label">Scale</span>
    </div>
    <div class="icon-item">
        <div class="icon-wrapper icon-accent-4">
            <i data-lucide="heart"></i>
        </div>
        <span class="icon-label">Trust</span>
    </div>
</div>
```

Colored icons in cards:

```html
<div class="cards-grid">
    <div class="card">
        <div class="icon-wrapper icon-accent-1" style="margin-bottom: 1rem;">
            <i data-lucide="cpu"></i>
        </div>
        <h4>AI-Powered</h4>
        <p>Next-gen intelligence</p>
    </div>
    <div class="card">
        <div class="icon-wrapper icon-accent-2" style="margin-bottom: 1rem;">
            <i data-lucide="rocket"></i>
        </div>
        <h4>Fast Deploy</h4>
        <p>Minutes, not months</p>
    </div>
</div>
```

---

## Inline Icons

Use `<i data-lucide="...">` anywhere — in cards, meta items, headings, or paragraphs.

**In cards:**
```html
<div class="card">
    <div class="icon-wrapper" style="margin-bottom: 1rem;">
        <i data-lucide="zap"></i>
    </div>
    <h4>Fast</h4>
    <p>Optimized for speed</p>
</div>
```

**In title slide meta:**
```html
<div class="meta-item">
    <i data-lucide="user"></i>
    <span>Author Name</span>
</div>
<div class="meta-item">
    <i data-lucide="calendar"></i>
    <span>March 2026</span>
</div>
```

**Inline in text:**
```html
<p>Click the <i data-lucide="settings"></i> icon to configure.</p>
```

---

## Common Icons by Category

### People & Identity
| Icon | Name |
|------|------|
| User | `user` |
| Users | `users` |
| User Check | `user-check` |
| Contact | `contact` |
| Badge Check | `badge-check` |

### Time & Schedule
| Icon | Name |
|------|------|
| Calendar | `calendar` |
| Clock | `clock` |
| Timer | `timer` |
| Hourglass | `hourglass` |
| Calendar Check | `calendar-check` |

### Status & Feedback
| Icon | Name |
|------|------|
| Check | `check` |
| Circle Check | `circle-check` |
| Circle X | `circle-x` |
| Alert Triangle | `triangle-alert` |
| Circle Alert | `circle-alert` |
| Star | `star` |
| Thumbs Up | `thumbs-up` |
| Heart | `heart` |

### Actions & Concepts
| Icon | Name |
|------|------|
| Zap (Lightning) | `zap` |
| Rocket | `rocket` |
| Search | `search` |
| Settings | `settings` |
| Target | `target` |
| Lightbulb | `lightbulb` |
| Sparkles | `sparkles` |
| Flame | `flame` |
| Wand | `wand-sparkles` |

### Data & Charts
| Icon | Name |
|------|------|
| Bar Chart | `chart-bar` |
| Line Chart | `chart-line` |
| Pie Chart | `chart-pie` |
| Trending Up | `trending-up` |
| Trending Down | `trending-down` |
| Activity | `activity` |
| Database | `database` |

### Technology
| Icon | Name |
|------|------|
| Code | `code` |
| Terminal | `terminal` |
| Server | `server` |
| Cpu | `cpu` |
| Wifi | `wifi` |
| Cloud | `cloud` |
| Smartphone | `smartphone` |
| Monitor | `monitor` |
| Hard Drive | `hard-drive` |
| Network | `network` |
| Blocks | `blocks` |
| Workflow | `workflow` |
| Git Branch | `git-branch` |
| Container | `container` |
| Braces | `braces` |

### Security & Trust
| Icon | Name |
|------|------|
| Shield | `shield` |
| Shield Check | `shield-check` |
| Lock | `lock` |
| Unlock | `unlock` |
| Key | `key` |
| Eye | `eye` |
| Eye Off | `eye-off` |
| Fingerprint | `fingerprint` |
| Scan | `scan` |

### Communication & Content
| Icon | Name |
|------|------|
| Mail | `mail` |
| Message Square | `message-square` |
| Send | `send` |
| Link | `link` |
| Share | `share-2` |
| Bell | `bell` |
| Megaphone | `megaphone` |

### Navigation & Structure
| Icon | Name |
|------|------|
| Globe | `globe` |
| Layers | `layers` |
| Layout | `layout-dashboard` |
| Map | `map` |
| Compass | `compass` |
| Building | `building` |
| Boxes | `boxes` |

### Files & Documents
| Icon | Name |
|------|------|
| File | `file` |
| File Text | `file-text` |
| Folder | `folder` |
| Download | `download` |
| Upload | `upload` |
| Clipboard | `clipboard` |
| Book | `book-open` |
| Notebook | `notebook-pen` |

### Business & Finance
| Icon | Name |
|------|------|
| Dollar Sign | `dollar-sign` |
| Wallet | `wallet` |
| Credit Card | `credit-card` |
| Receipt | `receipt` |
| Briefcase | `briefcase` |
| Landmark | `landmark` |
| Handshake | `handshake` |
| Scale | `scale` |

### Media & Creative
| Icon | Name |
|------|------|
| Image | `image` |
| Camera | `camera` |
| Video | `video` |
| Music | `music` |
| Palette | `palette` |
| Pen Tool | `pen-tool` |
| Figma | `figma` |

### Arrows & Direction
| Icon | Name |
|------|------|
| Arrow Right | `arrow-right` |
| Arrow Up Right | `arrow-up-right` |
| Move Right | `move-right` |
| Chevron Right | `chevron-right` |
| Redo | `redo` |
| Repeat | `repeat` |
| Shuffle | `shuffle` |
| Maximize | `maximize` |

Browse all 1,500+ icons at [lucide.dev/icons](https://lucide.dev/icons). Use the exact name shown on the site as the `data-lucide` value.

---

## Examples

### Technology Stack

```html
<div class="icon-grid">
    <div class="icon-item">
        <div class="icon-wrapper">
            <i data-lucide="layers"></i>
        </div>
        <span class="icon-label">React</span>
    </div>
    <div class="icon-item">
        <div class="icon-wrapper">
            <i data-lucide="braces"></i>
        </div>
        <span class="icon-label">TypeScript</span>
    </div>
    <div class="icon-item">
        <div class="icon-wrapper">
            <i data-lucide="server"></i>
        </div>
        <span class="icon-label">Node.js</span>
    </div>
    <div class="icon-item">
        <div class="icon-wrapper">
            <i data-lucide="database"></i>
        </div>
        <span class="icon-label">PostgreSQL</span>
    </div>
</div>
```

### Compact Icon Grid

```html
<div class="icon-grid compact">
    <div class="icon-item">
        <div class="icon-wrapper">
            <i data-lucide="circle-check"></i>
        </div>
        <span class="icon-label">Verified</span>
    </div>
    <div class="icon-item">
        <div class="icon-wrapper">
            <i data-lucide="shield-check"></i>
        </div>
        <span class="icon-label">Secure</span>
    </div>
    <div class="icon-item">
        <div class="icon-wrapper">
            <i data-lucide="zap"></i>
        </div>
        <span class="icon-label">Fast</span>
    </div>
    <div class="icon-item">
        <div class="icon-wrapper">
            <i data-lucide="globe"></i>
        </div>
        <span class="icon-label">Global</span>
    </div>
</div>
```

### Cards with Icons

```html
<div class="cards-grid">
    <div class="card">
        <div class="icon-wrapper" style="margin-bottom: 1rem;">
            <i data-lucide="shield-check"></i>
        </div>
        <h4>Enterprise Security</h4>
        <p>SOC2 compliant with end-to-end encryption</p>
    </div>
    <div class="card">
        <div class="icon-wrapper" style="margin-bottom: 1rem;">
            <i data-lucide="rocket"></i>
        </div>
        <h4>High Performance</h4>
        <p>Sub-millisecond response times globally</p>
    </div>
    <div class="card">
        <div class="icon-wrapper" style="margin-bottom: 1rem;">
            <i data-lucide="globe"></i>
        </div>
        <h4>Global Scale</h4>
        <p>Deploy to 30+ regions worldwide</p>
    </div>
</div>
```

### Large Hero Icons

```html
<div class="icon-grid">
    <div class="icon-item">
        <div class="icon-wrapper icon-lg">
            <i data-lucide="cpu"></i>
        </div>
        <span class="icon-label">AI-Powered</span>
    </div>
    <div class="icon-item">
        <div class="icon-wrapper icon-lg">
            <i data-lucide="network"></i>
        </div>
        <span class="icon-label">Connected</span>
    </div>
    <div class="icon-item">
        <div class="icon-wrapper icon-lg">
            <i data-lucide="lock"></i>
        </div>
        <span class="icon-label">Secure</span>
    </div>
</div>
```

---

## Legacy: Inline SVG

Inline SVGs with `fill="currentColor"` still work and are fully supported. Use them when you need a custom icon not in the Lucide set.

```html
<svg viewBox="0 0 24 24" width="40" height="40">
    <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5z"/>
</svg>
```
