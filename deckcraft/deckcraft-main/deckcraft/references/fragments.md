# Fragment / Build Animations

Fragments let you reveal slide content incrementally. Elements with the `.fragment` class start hidden and appear one at a time when the user presses Next.

## How It Works

- **Next** (right arrow, space, enter): If unrevealed fragments exist on the current slide, reveals the next one instead of advancing the slide.
- **Previous** (left arrow): If revealed fragments exist, hides the last one instead of going to the previous slide.
- Navigating to a slide via `goToSlide()` resets all its fragments to hidden.

## Configuration

Fragments are enabled by default. To disable:

```js
Presentation.init({
    enableFragments: false
});
```

## Basic Usage

Add the `.fragment` class to any element inside a slide:

```html
<div class="slide active">
    <h2>Key Points</h2>
    <p class="fragment">First point appears on click</p>
    <p class="fragment">Second point appears next</p>
    <p class="fragment">Third point appears last</p>
</div>
```

## Animation Types

| Class | Effect |
|-------|--------|
| `.fragment` | Default: fade up from below |
| `.fragment.fade-in` | Simple opacity fade (no movement) |
| `.fragment.fade-up` | Fade in from below (same as default) |
| `.fragment.fade-down` | Fade in from above |
| `.fragment.fade-left` | Fade in from the left |
| `.fragment.fade-right` | Fade in from the right |
| `.fragment.grow` | Scale up from 50% size |
| `.fragment.shrink` | Scale down from 150% size |
| `.fragment.highlight-current` | Reveals normally, but dims all previously revealed fragments to 40% opacity |

## Examples

### Mixed animation types

```html
<div class="slide">
    <h2>Our Stack</h2>
    <div class="fragment fade-in">Frontend: React</div>
    <div class="fragment fade-right">Backend: Node.js</div>
    <div class="fragment grow">Database: PostgreSQL</div>
</div>
```

### Highlight current (spotlight effect)

```html
<div class="slide">
    <h2>Step by Step</h2>
    <p class="fragment highlight-current">Step 1: Research</p>
    <p class="fragment highlight-current">Step 2: Design</p>
    <p class="fragment highlight-current">Step 3: Build</p>
</div>
```

When Step 2 is revealed, Step 1 dims to 40% opacity. When Step 3 is revealed, both Step 1 and Step 2 dim.

### Fragments inside cards

```html
<div class="slide">
    <h2>Features</h2>
    <div class="cards-grid">
        <div class="card fragment fade-up">
            <h4>Feature A</h4>
            <p>Description</p>
        </div>
        <div class="card fragment fade-up">
            <h4>Feature B</h4>
            <p>Description</p>
        </div>
    </div>
</div>
```

## Notes

- Fragments are revealed in DOM order (top to bottom in the HTML).
- Fragment animations use `opacity` and `transform` with a 0.4s ease transition.
- Fragments only activate on the currently active slide.
- The `.visible` class is added/removed by the JS engine -- do not add it manually in HTML.
