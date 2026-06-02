# Data Display: Stats, Tables & Lists

## Stats

### `.stats-grid` + `.stat-card`

Metric/KPI display grid.

```html
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-value">99.9%</div>
    <div class="stat-label">Uptime</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">
      <span class="stat-trend up">&#8593;</span>
      45%
    </div>
    <div class="stat-label">Growth Rate</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">
      <span class="stat-trend down">&#8595;</span>
      12ms
    </div>
    <div class="stat-label">Response Time</div>
  </div>
</div>
```

| Class | Description |
|-------|-------------|
| `.stats-grid` | Auto-fit grid (min 200px) |
| `.stat-card` | Glassmorphism card, centered |
| `.stat-value` | Large number (3rem, bold) |
| `.stat-label` | Uppercase label below value |
| `.stat-trend` | Trend indicator container |
| `.stat-trend.up` | Green color with glow |
| `.stat-trend.down` | Red color with glow |

**Trend Arrow Characters:**
- Up: `&#8593;` or `&uarr;`
- Down: `&#8595;` or `&darr;`

---

## Tables

### `.table-container` + `table`

Styled data tables with glassmorphism.

```html
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>Basic</th>
        <th>Pro</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Storage</td>
        <td>10 GB</td>
        <td>100 GB</td>
      </tr>
    </tbody>
  </table>
</div>
```

- Headers: uppercase, 10% white background
- Cells: 80% white text
- Row hover: 5% white highlight
- Container: scrollable, rounded corners

---

## Lists

### Unordered Lists

```html
<ul>
  <li>First item with diamond bullet</li>
  <li>Second item in the list</li>
  <li>Third item here</li>
</ul>
```

- Custom diamond bullet (rotated square)
- 1.35rem font size, 80% white color, 1rem bottom margin per item

---

## Examples

### Four Metrics

```html
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-value">99.9%</div>
        <div class="stat-label">Uptime</div>
    </div>
    <div class="stat-card">
        <div class="stat-value">2.4M</div>
        <div class="stat-label">Active Users</div>
    </div>
    <div class="stat-card">
        <div class="stat-value">150ms</div>
        <div class="stat-label">Avg Response</div>
    </div>
    <div class="stat-card">
        <div class="stat-value">4.8/5</div>
        <div class="stat-label">User Rating</div>
    </div>
</div>
```

### Metrics with Trends

```html
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-value">
            <span class="stat-trend up">&uarr;</span>
            $4.2M
        </div>
        <div class="stat-label">Revenue</div>
    </div>
    <div class="stat-card">
        <div class="stat-value">
            <span class="stat-trend up">&uarr;</span>
            23%
        </div>
        <div class="stat-label">Growth Rate</div>
    </div>
    <div class="stat-card">
        <div class="stat-value">
            <span class="stat-trend down">&darr;</span>
            1.2%
        </div>
        <div class="stat-label">Churn Rate</div>
    </div>
    <div class="stat-card">
        <div class="stat-value">
            <span class="stat-trend up">&uarr;</span>
            87
        </div>
        <div class="stat-label">NPS Score</div>
    </div>
</div>
```

### Feature Comparison Table

```html
<div class="table-container">
    <table>
        <thead>
            <tr>
                <th>Feature</th>
                <th>DeckCraft</th>
                <th>Competitor A</th>
                <th>Competitor B</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Offline Support</td>
                <td>Full</td>
                <td>None</td>
                <td>Partial</td>
            </tr>
            <tr style="background: var(--white-10);">
                <td><strong>Zero Dependencies</strong></td>
                <td>Yes</td>
                <td>No</td>
                <td>No</td>
            </tr>
            <tr>
                <td>Custom Themes</td>
                <td>8 built-in + custom</td>
                <td>3 themes</td>
                <td>Premium only</td>
            </tr>
            <tr>
                <td>File Size</td>
                <td>&lt;50KB</td>
                <td>2.5MB</td>
                <td>1.8MB</td>
            </tr>
            <tr>
                <td>Export Options</td>
                <td>HTML, PDF</td>
                <td>PDF only</td>
                <td>HTML, PDF, PPTX</td>
            </tr>
        </tbody>
    </table>
</div>
```

### Pricing Table

```html
<div class="table-container">
    <table>
        <thead>
            <tr>
                <th>Plan</th>
                <th>Users</th>
                <th>Storage</th>
                <th>Support</th>
                <th>Price/month</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Starter</td>
                <td>1-5</td>
                <td>10 GB</td>
                <td>Community</td>
                <td>Free</td>
            </tr>
            <tr style="background: var(--white-10);">
                <td><strong>Professional</strong></td>
                <td>6-25</td>
                <td>100 GB</td>
                <td>Email + Chat</td>
                <td>$49</td>
            </tr>
            <tr>
                <td>Team</td>
                <td>26-100</td>
                <td>500 GB</td>
                <td>Priority</td>
                <td>$149</td>
            </tr>
            <tr>
                <td>Enterprise</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
                <td>24/7 Dedicated</td>
                <td>Custom</td>
            </tr>
        </tbody>
    </table>
</div>
```

### Technical Specifications Table

```html
<div class="table-container">
    <table>
        <thead>
            <tr>
                <th>Specification</th>
                <th>Value</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Max Slides</td>
                <td>Unlimited</td>
                <td>Performance tested up to 500 slides</td>
            </tr>
            <tr>
                <td>File Formats</td>
                <td>HTML, Markdown</td>
                <td>PDF export via browser print</td>
            </tr>
            <tr style="background: var(--white-10);">
                <td><strong>Browser Support</strong></td>
                <td>Chrome, Firefox, Safari, Edge</td>
                <td>Last 2 major versions</td>
            </tr>
            <tr>
                <td>Keyboard Shortcuts</td>
                <td>15+ built-in</td>
                <td>Fully customizable</td>
            </tr>
            <tr>
                <td>Accessibility</td>
                <td>WCAG 2.1 AA</td>
                <td>Screen reader compatible</td>
            </tr>
        </tbody>
    </table>
</div>
```

### Feature List

```html
<ul>
    <li>Zero external dependencies for core functionality</li>
    <li>Eight professionally designed color themes</li>
    <li>Four style profiles for different contexts</li>
    <li>Keyboard navigation with customizable shortcuts</li>
    <li>Responsive design that works on any screen size</li>
</ul>
```
