# Tabbed Content Component

Requires `components-extra.css` and `components-extra.js`.

## Basic Tabs

```html
<div class="tabs-container">
    <div class="tabs-nav">
        <button class="tab-btn active" data-tab="overview">Overview</button>
        <button class="tab-btn" data-tab="details">Details</button>
        <button class="tab-btn" data-tab="code">Code</button>
    </div>
    <div class="tabs-content">
        <div class="tab-panel active" data-tab="overview">
            <p>Overview content here.</p>
        </div>
        <div class="tab-panel" data-tab="details">
            <p>Detailed information here.</p>
        </div>
        <div class="tab-panel" data-tab="code">
            <pre class="code-block"><code>console.log('hello');</code></pre>
        </div>
    </div>
</div>
```

- The first tab and panel should both have the `active` class
- `data-tab` values must match between buttons and panels
- Panels can contain any content (text, code blocks, lists, cards, etc.)

## With Rich Content

```html
<div class="tabs-container">
    <div class="tabs-nav">
        <button class="tab-btn active" data-tab="frontend">Frontend</button>
        <button class="tab-btn" data-tab="backend">Backend</button>
        <button class="tab-btn" data-tab="infra">Infrastructure</button>
    </div>
    <div class="tabs-content">
        <div class="tab-panel active" data-tab="frontend">
            <h3>Frontend Stack</h3>
            <ul>
                <li>React with TypeScript</li>
                <li>Tailwind CSS for styling</li>
                <li>Vite for build tooling</li>
            </ul>
        </div>
        <div class="tab-panel" data-tab="backend">
            <h3>Backend Stack</h3>
            <ul>
                <li>Node.js with Express</li>
                <li>PostgreSQL database</li>
                <li>Redis for caching</li>
            </ul>
        </div>
        <div class="tab-panel" data-tab="infra">
            <h3>Infrastructure</h3>
            <ul>
                <li>AWS ECS for containers</li>
                <li>CloudFront CDN</li>
                <li>Terraform for IaC</li>
            </ul>
        </div>
    </div>
</div>
```

## How It Works

- CSS handles styling, glassmorphism background, and fade-in animation
- JavaScript auto-initializes all `.tabs-container` elements on page load
- Clicking a tab button activates the matching panel and deactivates others
- Active panels fade in with a subtle upward animation

## Including in HTML

Add to your presentation `<head>` and before `</body>`:

```html
<head>
    <link rel="stylesheet" href="lib/components-extra.css">
</head>
<body>
    <!-- slides... -->
    <script src="lib/components-extra.js"></script>
</body>
```
