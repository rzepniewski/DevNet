# Complete Slide Examples

Full ready-to-use slide examples combining multiple components.

## Title Slide

```html
<div class="slide title-slide">
    <div class="slide-content">
        <h1>DeckCraft</h1>
        <div class="subtitle">The offline-first presentation framework</div>
        <div class="meta">
            <div class="meta-item">
                <i data-lucide="calendar"></i>
                <span>January 2024</span>
            </div>
            <div class="meta-item">
                <i data-lucide="user"></i>
                <span>Engineering Team</span>
            </div>
        </div>
    </div>
</div>
```

## Content Slide with Stats

```html
<div class="slide">
    <div class="slide-content">
        <span class="tag">Performance</span>
        <h2>Built for Speed</h2>
        <p>Every millisecond counts when you're presenting to stakeholders.</p>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">&lt;50KB</div>
                <div class="stat-label">Total Size</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">0</div>
                <div class="stat-label">Dependencies</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">100ms</div>
                <div class="stat-label">First Paint</div>
            </div>
        </div>

        <div class="highlight-box">
            <p>Load instantly, present confidently - even without an internet connection.</p>
        </div>
    </div>
</div>
```

## Content Slide with Cards

```html
<div class="slide">
    <div class="slide-content">
        <span class="tag">Features</span>
        <h2 class="title-gradient">Key Capabilities</h2>
        <div class="cards-grid">
            <div class="card">
                <h4>Fast</h4>
                <p>Optimized for performance</p>
            </div>
            <div class="card">
                <h4>Beautiful</h4>
                <p>Modern glassmorphism design</p>
            </div>
        </div>
    </div>
</div>
```

## Slide with Flow Diagram

```html
<div class="slide">
    <div class="slide-content">
        <span class="tag">Architecture</span>
        <h2>Request Flow</h2>
        <p>How data moves through our system</p>

        <div class="diagram">
            <div class="flow-diagram">
                <div class="flow-box">
                    <h4>Client</h4>
                    <p>Browser request</p>
                </div>
                <div class="flow-arrow">&rarr;</div>
                <div class="flow-box">
                    <h4>CDN</h4>
                    <p>Edge caching</p>
                </div>
                <div class="flow-arrow">&rarr;</div>
                <div class="flow-box highlight">
                    <h4>API Gateway</h4>
                    <p>Auth & routing</p>
                </div>
                <div class="flow-arrow">&rarr;</div>
                <div class="flow-box">
                    <h4>Services</h4>
                    <p>Business logic</p>
                </div>
            </div>
        </div>
    </div>
</div>
```

## Full HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="presentation.css">
</head>
<body class="theme-mesh">
  <div class="presentation">

    <!-- Title Slide -->
    <div class="slide title-slide active">
      <div class="slide-content">
        <h1>Project Overview</h1>
        <p class="subtitle">Building the future of presentations</p>
        <div class="meta">
          <div class="meta-item">
            <i data-lucide="user"></i>
            <span>Team Name</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Slide -->
    <div class="slide">
      <div class="slide-content">
        <span class="tag">Features</span>
        <h2 class="title-gradient">Key Capabilities</h2>
        <div class="cards-grid">
          <div class="card">
            <h4>Fast</h4>
            <p>Optimized for performance</p>
          </div>
          <div class="card">
            <h4>Beautiful</h4>
            <p>Modern glassmorphism design</p>
          </div>
        </div>
      </div>
    </div>

  </div>
  <script src="presentation.js"></script>
</body>
</html>
```
