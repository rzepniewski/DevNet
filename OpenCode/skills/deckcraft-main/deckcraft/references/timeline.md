# Timeline

## `.timeline`

Horizontal timeline with progress states.

```html
<div class="timeline">
  <div class="timeline-item completed">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
      <h4>Q1 2024</h4>
      <p>Research phase</p>
    </div>
  </div>
  <div class="timeline-item active">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
      <h4>Q2 2024</h4>
      <p>Development</p>
    </div>
  </div>
  <div class="timeline-item">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
      <h4>Q3 2024</h4>
      <p>Launch</p>
    </div>
  </div>
</div>
```

| Class | Description |
|-------|-------------|
| `.timeline` | Horizontal flex container with connecting line |
| `.timeline.vertical` | Vertical variant |
| `.timeline-item` | Individual timeline entry |
| `.timeline-item.completed` | Filled marker (past event) |
| `.timeline-item.active` | Glowing marker with inner dot (current) |
| `.timeline-marker` | Circular progress indicator |
| `.timeline-content` | Text content (h4 + p) |

### Vertical Variant

```html
<div class="timeline vertical">
  <div class="timeline-item completed">
    <div class="timeline-marker"></div>
    <div class="timeline-content">
      <h4>Step 1</h4>
      <p>Completed task</p>
    </div>
  </div>
  <!-- more items -->
</div>
```

Use for project roadmaps, process steps, historical events.

---

## Examples

### Horizontal Roadmap

```html
<div class="timeline">
    <div class="timeline-item completed">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>Q1 2024</h4>
            <p>Research and planning phase</p>
        </div>
    </div>
    <div class="timeline-item completed">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>Q2 2024</h4>
            <p>Core development and MVP</p>
        </div>
    </div>
    <div class="timeline-item active">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>Q3 2024</h4>
            <p>Beta launch and testing</p>
        </div>
    </div>
    <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>Q4 2024</h4>
            <p>Public release and scale</p>
        </div>
    </div>
</div>
```

### Vertical History

```html
<div class="timeline vertical">
    <div class="timeline-item completed">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>2020 - Foundation</h4>
            <p>Company founded with seed funding. Initial team of 5 engineers assembled.</p>
        </div>
    </div>
    <div class="timeline-item completed">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>2021 - First Product</h4>
            <p>Launched v1.0 to early adopters. Reached 10,000 users in first month.</p>
        </div>
    </div>
    <div class="timeline-item completed">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>2022 - Series A</h4>
            <p>Raised $15M Series A. Expanded team to 50 employees across 3 offices.</p>
        </div>
    </div>
    <div class="timeline-item active">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>2023 - Enterprise</h4>
            <p>Launched enterprise tier. Signed first Fortune 500 customers.</p>
        </div>
    </div>
    <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>2024 - Global Expansion</h4>
            <p>Opening offices in Europe and Asia. Targeting 1M users.</p>
        </div>
    </div>
</div>
```

### Product Launch Timeline

```html
<div class="timeline">
    <div class="timeline-item completed">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>Alpha</h4>
            <p>Internal testing</p>
        </div>
    </div>
    <div class="timeline-item completed">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>Beta</h4>
            <p>Limited public access</p>
        </div>
    </div>
    <div class="timeline-item active">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>GA</h4>
            <p>General availability</p>
        </div>
    </div>
    <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h4>v2.0</h4>
            <p>Major feature release</p>
        </div>
    </div>
</div>
```
