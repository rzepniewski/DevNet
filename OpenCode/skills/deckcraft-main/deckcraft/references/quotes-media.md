# Quotes & Animation

## Quote Block

### `.quote-block`

Testimonial or citation block.

```html
<div class="quote-block">
  <div class="quote-text">
    "This framework changed how we build presentations entirely."
  </div>
  <div class="quote-attribution">
    <span class="quote-author">Jane Smith</span>
    <span class="quote-title">CTO, TechCorp</span>
  </div>
</div>
```

| Class | Description |
|-------|-------------|
| `.quote-block` | Main container (max 900px, centered) |
| `.quote-avatar` | Optional circular image (80px) |
| `.quote-text` | Large italic quote (2rem) |
| `.quote-attribution` | Author info container |
| `.quote-author` | Bold name (uppercase) |
| `.quote-title` | Role/company (lighter) |

**With Avatar:**

```html
<div class="quote-block">
  <img class="quote-avatar" src="avatar.jpg" alt="Author">
  <div class="quote-text">"A powerful statement."</div>
  <div class="quote-attribution">
    <span class="quote-author">Source Name</span>
    <span class="quote-title">Publication, Year</span>
  </div>
</div>
```

---

## Animation

### `.typing-text`

CSS-only typing animation effect.

```html
<div class="typing-text" style="--characters: 25; --duration: 2s">
  npm install deckcraft
</div>
```

**Required CSS Variables (inline style):**

| Variable | Description |
|----------|-------------|
| `--characters` | Number of characters in text |
| `--duration` | Total animation duration |

**Optional:** `--cursor-blink` (default 0.7s)

| Class | Effect |
|-------|--------|
| `.typing-text.no-cursor` | Hide blinking cursor |
| `.typing-text.loop` | Repeat animation infinitely |

---

## Examples

### Simple Quote

```html
<div class="quote-block">
    <div class="quote-text">
        "DeckCraft transformed how we deliver presentations. The offline capability
        alone saved us during a critical client meeting when the WiFi went down."
    </div>
    <div class="quote-attribution">
        <span class="quote-author">Sarah Chen</span>
        <span class="quote-title">VP of Sales, TechCorp Inc.</span>
    </div>
</div>
```

### Quote with Avatar

```html
<div class="quote-block">
    <img class="quote-avatar" src="https://i.pravatar.cc/150?img=32" alt="Marcus Johnson">
    <div class="quote-text">
        "We evaluated five different presentation tools before choosing DeckCraft.
        The zero-dependency architecture and blazing fast performance made it
        the clear winner for our engineering team."
    </div>
    <div class="quote-attribution">
        <span class="quote-author">Marcus Johnson</span>
        <span class="quote-title">CTO, DataFlow Systems</span>
    </div>
</div>
```

### Quote with Section Tag

```html
<span class="tag">Customer Story</span>
<div class="quote-block">
    <div class="quote-text">
        "After switching to DeckCraft, our presentation load times dropped from
        8 seconds to under 200 milliseconds. Our global sales team can now present
        confidently from any location, even with poor connectivity."
    </div>
    <div class="quote-attribution">
        <span class="quote-author">Elena Rodriguez</span>
        <span class="quote-title">Director of Operations, GlobalTech</span>
    </div>
</div>
```

### Simple Typing Effect

```html
<div class="typing-text" style="--characters: 21; --duration: 2s;">
npm install deckcraft
</div>
```

### Typing in Terminal

```html
<div class="terminal">
    <div class="terminal-header">
        <span class="terminal-dot red"></span>
        <span class="terminal-dot yellow"></span>
        <span class="terminal-dot green"></span>
        <span class="terminal-title">demo</span>
    </div>
    <div class="terminal-body">
        <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="typing-text" style="--characters: 21; --duration: 2s;">
npm install deckcraft</span>
        </div>
    </div>
</div>
```
