# Flow Diagrams

## `.flow-diagram`, `.flow-box`, `.flow-arrow`

Horizontal process/flow visualization.

```html
<div class="diagram">
  <div class="flow-diagram">
    <div class="flow-box">
      <h4>Step 1</h4>
      <p>Description</p>
    </div>
    <span class="flow-arrow">&#8594;</span>
    <div class="flow-box highlight">
      <h4>Step 2</h4>
      <p>Current step</p>
    </div>
    <span class="flow-arrow">&#8594;</span>
    <div class="flow-box">
      <h4>Step 3</h4>
      <p>Final step</p>
    </div>
  </div>
</div>
```

| Class | Description |
|-------|-------------|
| `.flow-diagram` | Flex container, centered, wrapping |
| `.flow-box` | Individual step/node (min-width: 180px) |
| `.flow-box.highlight` | Emphasized node with glow |
| `.flow-arrow` | Arrow text between nodes |

**Arrow Characters:**
- Horizontal: `&#8594;` or `&rarr;` (right arrow)
- Vertical: `&#8595;` or `&darr;` (down arrow)

Use for process flows, pipelines, step sequences.

---

## Examples

### Three-Step Process

```html
<div class="diagram">
    <div class="flow-diagram">
        <div class="flow-box">
            <h4>Design</h4>
            <p>Create your content structure</p>
        </div>
        <div class="flow-arrow">&rarr;</div>
        <div class="flow-box highlight">
            <h4>Build</h4>
            <p>Generate HTML presentation</p>
        </div>
        <div class="flow-arrow">&rarr;</div>
        <div class="flow-box">
            <h4>Present</h4>
            <p>Share with your audience</p>
        </div>
    </div>
</div>
```

### Five-Step with Highlight

```html
<div class="diagram">
    <div class="flow-diagram">
        <div class="flow-box">
            <h4>Research</h4>
            <p>Gather requirements</p>
        </div>
        <div class="flow-arrow">&rarr;</div>
        <div class="flow-box">
            <h4>Plan</h4>
            <p>Define architecture</p>
        </div>
        <div class="flow-arrow">&rarr;</div>
        <div class="flow-box highlight">
            <h4>Develop</h4>
            <p>Build the solution</p>
        </div>
        <div class="flow-arrow">&rarr;</div>
        <div class="flow-box">
            <h4>Test</h4>
            <p>Validate quality</p>
        </div>
        <div class="flow-arrow">&rarr;</div>
        <div class="flow-box">
            <h4>Deploy</h4>
            <p>Release to production</p>
        </div>
    </div>
</div>
```

### Data Pipeline Flow

```html
<div class="diagram">
    <div class="flow-diagram">
        <div class="flow-box">
            <h4>Ingest</h4>
            <p>Collect raw data from APIs and streams</p>
        </div>
        <div class="flow-arrow">&rarr;</div>
        <div class="flow-box">
            <h4>Transform</h4>
            <p>Clean, validate, and normalize</p>
        </div>
        <div class="flow-arrow">&rarr;</div>
        <div class="flow-box highlight">
            <h4>Analyze</h4>
            <p>Apply ML models and aggregations</p>
        </div>
        <div class="flow-arrow">&rarr;</div>
        <div class="flow-box">
            <h4>Visualize</h4>
            <p>Generate dashboards and reports</p>
        </div>
    </div>
</div>
```
