# CSS/SVG Chart Components

Requires `components-extra.css`. No JavaScript needed -- charts use CSS custom properties and animate when the slide becomes active.

## Horizontal Bar Chart

```html
<div class="bar-chart">
    <div class="bar-item">
        <span class="bar-label">JavaScript</span>
        <div class="bar-track">
            <div class="bar" style="--value: 85"></div>
        </div>
        <span class="bar-value">85%</span>
    </div>
    <div class="bar-item">
        <span class="bar-label">Python</span>
        <div class="bar-track">
            <div class="bar" style="--value: 72"></div>
        </div>
        <span class="bar-value">72%</span>
    </div>
    <div class="bar-item">
        <span class="bar-label">Rust</span>
        <div class="bar-track">
            <div class="bar" style="--value: 45"></div>
        </div>
        <span class="bar-value">45%</span>
    </div>
</div>
```

Set `--value` from 0 to 100. The bar animates from 0 to the target width when the slide becomes active.

## Vertical Bar Chart

```html
<div class="bar-chart vertical">
    <div class="bar-item">
        <div class="bar-track">
            <div class="bar" style="--value: 70"></div>
        </div>
        <span class="bar-label">Q1</span>
    </div>
    <div class="bar-item">
        <div class="bar-track">
            <div class="bar" style="--value: 85"></div>
        </div>
        <span class="bar-label">Q2</span>
    </div>
    <div class="bar-item">
        <div class="bar-track">
            <div class="bar" style="--value: 60"></div>
        </div>
        <span class="bar-label">Q3</span>
    </div>
    <div class="bar-item">
        <div class="bar-track">
            <div class="bar" style="--value: 92"></div>
        </div>
        <span class="bar-label">Q4</span>
    </div>
</div>
```

Vertical bars grow upward from the bottom. Default height is 250px.

## Donut Chart (SVG)

```html
<div class="donut-chart" style="--value: 75; --size: 150">
    <svg viewBox="0 0 36 36">
        <circle class="donut-ring" cx="18" cy="18" r="15.9" />
        <circle class="donut-segment" cx="18" cy="18" r="15.9" />
    </svg>
    <div class="donut-label">75%</div>
</div>
```

- `--value`: Percentage 0-100
- `--size`: Diameter in pixels (default 150)
- Ring fills clockwise from the top when the slide becomes active

### Multiple Donut Charts

```html
<div style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
    <div class="donut-chart" style="--value: 90; --size: 120">
        <svg viewBox="0 0 36 36">
            <circle class="donut-ring" cx="18" cy="18" r="15.9" />
            <circle class="donut-segment" cx="18" cy="18" r="15.9" />
        </svg>
        <div class="donut-label">90%</div>
    </div>
    <div class="donut-chart" style="--value: 65; --size: 120">
        <svg viewBox="0 0 36 36">
            <circle class="donut-ring" cx="18" cy="18" r="15.9" />
            <circle class="donut-segment" cx="18" cy="18" r="15.9" />
        </svg>
        <div class="donut-label">65%</div>
    </div>
</div>
```

## Progress Ring

Smaller variant of donut chart, ideal for inline metrics.

```html
<div class="progress-ring" style="--value: 60; --size: 120">
    <svg viewBox="0 0 36 36">
        <circle class="ring-bg" cx="18" cy="18" r="15.9" />
        <circle class="ring-fill" cx="18" cy="18" r="15.9" />
    </svg>
    <span class="ring-label">60%</span>
</div>
```

- `--value`: Percentage 0-100
- `--size`: Diameter in pixels (default 120)

## Animation Behavior

All charts animate from zero to their target value when the containing `.slide` gains the `.active` class. When navigating away, values reset to zero so they re-animate on return.

## Including in HTML

Add to your presentation `<head>`:

```html
<link rel="stylesheet" href="lib/components-extra.css">
```
