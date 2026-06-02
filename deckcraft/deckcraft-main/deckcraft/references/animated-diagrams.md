# Animated Flow Diagrams

Requires `components-extra.css`. Enhances the existing `.flow-diagram` component with sequential reveal animations.

## Basic Animated Flow

Add the `animated` class to a `.flow-diagram` to enable sequential fade-in when the slide becomes active.

```html
<div class="diagram">
    <div class="flow-diagram animated">
        <div class="flow-box">
            <h4>Input</h4>
            <p>User request</p>
        </div>
        <span class="flow-arrow">&#8594;</span>
        <div class="flow-box">
            <h4>Process</h4>
            <p>Handle request</p>
        </div>
        <span class="flow-arrow">&#8594;</span>
        <div class="flow-box">
            <h4>Output</h4>
            <p>Return response</p>
        </div>
    </div>
</div>
```

Elements appear sequentially (each child delayed by 0.2s) using nth-child rules. Supports up to 10 children by default.

## Custom Timing with --index

For precise control over animation order, use the `--index` custom property:

```html
<div class="diagram">
    <div class="flow-diagram animated">
        <div class="flow-box" style="--index: 0">
            <h4>Step 1</h4>
        </div>
        <span class="flow-arrow" style="--index: 1">&#8594;</span>
        <div class="flow-box" style="--index: 2">
            <h4>Step 2</h4>
        </div>
        <span class="flow-arrow" style="--index: 3">&#8594;</span>
        <div class="flow-box" style="--index: 4">
            <h4>Step 3</h4>
        </div>
    </div>
</div>
```

Each element appears after `--index * 0.2s` delay.

## Pulse Effect

Add `.pulse` to a flow-box to create a continuous pulsing glow. Useful for highlighting the current or important step.

```html
<div class="flow-diagram animated">
    <div class="flow-box">
        <h4>Start</h4>
    </div>
    <span class="flow-arrow">&#8594;</span>
    <div class="flow-box highlight pulse">
        <h4>Current Step</h4>
    </div>
    <span class="flow-arrow">&#8594;</span>
    <div class="flow-box">
        <h4>End</h4>
    </div>
</div>
```

The pulse animation starts after the fade-in completes.

## Flow Line (Alternative to Arrow)

Use `.flow-line` for a drawn-line connector instead of a text arrow:

```html
<div class="flow-diagram animated">
    <div class="flow-box" style="--index: 0">
        <h4>Source</h4>
    </div>
    <div class="flow-line" style="--index: 1"></div>
    <div class="flow-box" style="--index: 2">
        <h4>Destination</h4>
    </div>
</div>
```

The line draws from left to right with an arrowhead.

## Animation Behavior

- Elements are hidden (`opacity: 0`) until the parent `.slide` becomes `.active`
- Each element fades in and slides up sequentially
- When navigating away from the slide, elements reset to hidden
- Pulse animations loop infinitely once started

## Including in HTML

Add to your presentation `<head>`:

```html
<link rel="stylesheet" href="lib/components-extra.css">
```
