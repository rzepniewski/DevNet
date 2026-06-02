# Code & Terminal

## `.code-block`

Syntax-highlighted code container.

```html
<div class="code-block">
  <code>npm install deckcraft
npm run build</code>
</div>
```

**Properties:**
- Monospace font (JetBrains Mono)
- Dark background with blur
- Scrollable overflow
- Font size: 0.9rem

**With Prism.js syntax highlighting:**

```html
<div class="code-block">
  <code class="language-javascript">const app = express();
app.listen(3000);</code>
</div>
```

**Supported languages:** `javascript` (js), `typescript` (ts), `python` (py), `bash` (sh, shell), `html` (markup, xml), `css`, `json` (jsonc), `go`, `rust`, `sql`, `yaml` (yml), `jsx`

**Standalone `<pre>` block** (no `.code-block` wrapper needed):

```html
<pre class="language-python"><code>def hello():
    print("Hello, world!")</code></pre>
```

---

## `.cmd`

Inline command or code snippet.

```html
<p>Run <span class="cmd">npm install</span> to install dependencies.</p>
```

- Monospace font, dark background with border, inline display

---

## `.terminal`

macOS-style terminal mockup.

```html
<div class="terminal">
  <div class="terminal-header">
    <span class="terminal-dot red"></span>
    <span class="terminal-dot yellow"></span>
    <span class="terminal-dot green"></span>
    <span class="terminal-title">Terminal</span>
  </div>
  <div class="terminal-body">
    <div class="terminal-line">
      <span class="terminal-prompt">$</span>
      <span class="terminal-command">npm install deckcraft</span>
    </div>
    <div class="terminal-line">
      <span class="terminal-output">Installing packages...</span>
    </div>
    <div class="terminal-line success">
      <span class="terminal-output">Done in 2.3s</span>
    </div>
  </div>
</div>
```

| Class | Description |
|-------|-------------|
| `.terminal` | Main container with dark background |
| `.terminal-header` | Header bar with window controls |
| `.terminal-dot.red` | Close button dot |
| `.terminal-dot.yellow` | Minimize button dot |
| `.terminal-dot.green` | Maximize button dot |
| `.terminal-title` | Window title text |
| `.terminal-body` | Content area |
| `.terminal-line` | Single line of output |
| `.terminal-prompt` | Command prompt symbol ($) |
| `.terminal-command` | User-entered command |
| `.terminal-output` | Command output text |

**Line State Modifiers:**

| Class | Color | Use Case |
|-------|-------|----------|
| `.terminal-line.success` | Green | Success messages |
| `.terminal-line.error` | Red | Error messages |
| `.terminal-line.warning` | Yellow | Warning messages |
| `.terminal-line.info` | Cyan | Info messages |

---

## Examples

### Simple Command

```html
<div class="terminal">
    <div class="terminal-header">
        <span class="terminal-dot red"></span>
        <span class="terminal-dot yellow"></span>
        <span class="terminal-dot green"></span>
        <span class="terminal-title">Terminal</span>
    </div>
    <div class="terminal-body">
        <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-command">npm install deckcraft</span>
        </div>
    </div>
</div>
```

### Multi-line with Output

```html
<div class="terminal">
    <div class="terminal-header">
        <span class="terminal-dot red"></span>
        <span class="terminal-dot yellow"></span>
        <span class="terminal-dot green"></span>
        <span class="terminal-title">bash - project</span>
    </div>
    <div class="terminal-body">
        <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-command">npm install deckcraft</span>
        </div>
        <div class="terminal-line">
            <span class="terminal-output">added 1 package in 0.8s</span>
        </div>
        <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-command">npx deckcraft init my-presentation</span>
        </div>
        <div class="terminal-line success">
            <span class="terminal-output">Created my-presentation/</span>
        </div>
        <div class="terminal-line success">
            <span class="terminal-output">Ready to build your presentation!</span>
        </div>
    </div>
</div>
```

### Git Workflow Example

```html
<div class="terminal">
    <div class="terminal-header">
        <span class="terminal-dot red"></span>
        <span class="terminal-dot yellow"></span>
        <span class="terminal-dot green"></span>
        <span class="terminal-title">git</span>
    </div>
    <div class="terminal-body">
        <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-command">git status</span>
        </div>
        <div class="terminal-line">
            <span class="terminal-output">On branch feature/new-theme</span>
        </div>
        <div class="terminal-line info">
            <span class="terminal-output">Changes to be committed:</span>
        </div>
        <div class="terminal-line success">
            <span class="terminal-output">    modified: presentation.css</span>
        </div>
        <div class="terminal-line success">
            <span class="terminal-output">    new file: themes/custom.css</span>
        </div>
        <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-command">git commit -m "Add custom theme support"</span>
        </div>
        <div class="terminal-line success">
            <span class="terminal-output">[feature/new-theme 3a2b1c0] Add custom theme support</span>
        </div>
    </div>
</div>
```

### Error Output Example

```html
<div class="terminal">
    <div class="terminal-header">
        <span class="terminal-dot red"></span>
        <span class="terminal-dot yellow"></span>
        <span class="terminal-dot green"></span>
        <span class="terminal-title">npm</span>
    </div>
    <div class="terminal-body">
        <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-command">npm run build</span>
        </div>
        <div class="terminal-line warning">
            <span class="terminal-output">warn: deprecated package detected</span>
        </div>
        <div class="terminal-line error">
            <span class="terminal-output">error: Cannot find module 'missing-dep'</span>
        </div>
        <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-command">npm install missing-dep</span>
        </div>
        <div class="terminal-line success">
            <span class="terminal-output">added 1 package in 1.2s</span>
        </div>
    </div>
</div>
```

### JavaScript Code Block

```html
<div class="code-block">
<code>// Initialize DeckCraft presentation
const presentation = new DeckCraft({
    theme: 'mesh',
    profile: 'tech',
    autoPlay: false,
    transitionDuration: 500
});

presentation.on('slideChange', (index) => {
    console.log(`Now showing slide ${index + 1}`);
});

presentation.start();</code>
</div>
```

### Python Code Block

```html
<div class="code-block">
<code>import deckcraft

# Create a new presentation
deck = deckcraft.Presentation(
    title="Q4 Results",
    theme="emerald"
)

# Add slides programmatically
deck.add_slide(
    type="title",
    content={"heading": "Q4 2024 Results"}
)

deck.add_slide(
    type="stats",
    content={"revenue": "$4.2M", "growth": "+23%"}
)

deck.export("q4-results.html")</code>
</div>
```

### Bash Code Block

```html
<div class="code-block">
<code>#!/bin/bash
# Deploy presentation to production

echo "Building presentation..."
npm run build

echo "Uploading to server..."
rsync -avz ./dist/ user@server:/var/www/presentation/

echo "Clearing CDN cache..."
curl -X POST https://api.cdn.com/purge \
    -H "Authorization: Bearer $CDN_TOKEN"

echo "Deployment complete!"</code>
</div>
```

### Inline Code

```html
<p>
    Run <span class="cmd">npm install</span> to install dependencies,
    then <span class="cmd">npm start</span> to launch the dev server.
</p>
```
