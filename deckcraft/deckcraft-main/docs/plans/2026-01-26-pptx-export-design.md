# PowerPoint Export Design

## Overview

Add PowerPoint (PPTX) export capability to DeckCraft presentations, enabling sharing with non-technical colleagues who expect/prefer PPTX format.

## Approach

**Image-based export** - Render each slide as a high-resolution PNG and embed as full-slide background images in PowerPoint.

### Rationale

- Preserves pixel-perfect glassmorphism effects (blur, gradients, overlays)
- Simple implementation extending existing Puppeteer PDF export pattern
- Solves the stated problem (viewable/presentable by recipients)
- Trade-off: Recipients cannot edit slide content

## Architecture

### File Structure

```
deckcraft/scripts/
├── export-pdf.js      # existing
└── export-pptx.js     # new
```

### Dependencies

- `puppeteer` - already used for PDF export
- `pptxgenjs` - lightweight library for creating PowerPoint files

### Export Flow

1. Load HTML presentation in headless browser
2. Hide UI elements (nav, theme switcher, progress bar)
3. For each slide:
   - Navigate to the slide
   - Capture as PNG at specified resolution (default 1920x1080)
4. Create PPTX document with 16:9 aspect ratio
5. Add each PNG as a full-slide background image
6. Write the final `.pptx` file

## CLI Interface

```bash
node export-pptx.js <presentation.html> [options]

Options:
  --output, -o <path>   Output PPTX path (default: same as input with .pptx extension)
  --width <pixels>      Viewport width (default: 1920)
  --height <pixels>     Viewport height (default: 1080)
  --theme <name>        Override theme (mesh|purple|cyan|emerald|orange|rose|blue|dark)
  --help, -h            Show help message
```

## Implementation

### Core Logic (export-pptx.js)

```javascript
const puppeteer = require('puppeteer');
const PptxGenJS = require('pptxgenjs');

async function exportPPTX(options) {
    // 1. Launch browser and load presentation (same as PDF export)
    // 2. Capture each slide as PNG buffer

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = options.title || 'DeckCraft Presentation';

    for (const imageBuffer of slideImages) {
        const slide = pptx.addSlide();
        slide.addImage({
            data: `image/png;base64,${imageBuffer.toString('base64')}`,
            x: 0, y: 0,
            w: '100%', h: '100%'
        });
    }

    await pptx.writeFile({ fileName: outputPath });
}
```

### Key Details

- Images stored as base64 in PPTX (self-contained, no external refs)
- Default 1920x1080 ensures crisp display on most screens
- PNG format preserves glassmorphism quality without compression artifacts

## Files to Modify

| File | Change |
|------|--------|
| `deckcraft/scripts/export-pptx.js` | Create new file |
| `deckcraft/scripts/package.json` | Add `pptxgenjs` dependency |
| `deckcraft/SKILL.md` | Add export documentation |

### SKILL.md Update

Add "Export" section after Build:

```markdown
### 5. Export (Optional)

**PDF Export:**
node <skill>/scripts/export-pdf.js output/presentation.html

**PowerPoint Export:**
node <skill>/scripts/export-pptx.js output/presentation.html
```

## Error Handling

- Validate input file exists
- Check for `.slide` elements before capturing
- Handle browser launch failures gracefully
- Provide clear error messages for missing dependencies

## Output Behavior

- Default output: `presentation.pptx` (same directory as input)
- Overridable with `--output` flag
- Console progress: `Capturing slide 1/7...` etc.
