# PowerPoint Export Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add PPTX export capability that renders slides as images and embeds them in PowerPoint.

**Architecture:** Extend existing Puppeteer-based PDF export pattern. Capture each slide as PNG, embed in PPTX using pptxgenjs library. Image-based approach preserves pixel-perfect glassmorphism effects.

**Tech Stack:** Node.js, Puppeteer (existing), pptxgenjs (new)

**Design Document:** `docs/plans/2026-01-26-pptx-export-design.md`

---

### Task 1: Add pptxgenjs Dependency

**Files:**
- Modify: `deckcraft/scripts/package.json`

**Step 1: Update package.json**

Add pptxgenjs to dependencies:

```json
{
  "name": "deckcraft",
  "version": "1.0.0",
  "private": true,
  "description": "Offline presentation framework",
  "scripts": {
    "export-pdf": "node scripts/export-pdf.js",
    "export-pptx": "node scripts/export-pptx.js"
  },
  "dependencies": {
    "pdf-lib": "^1.17.1",
    "pptxgenjs": "^3.12.0",
    "puppeteer": "^24.36.0"
  }
}
```

**Step 2: Install dependencies**

Run: `cd deckcraft/scripts && npm install`
Expected: `added X packages` with pptxgenjs installed

**Step 3: Commit**

```bash
git add deckcraft/scripts/package.json deckcraft/scripts/package-lock.json
git commit -m "chore: add pptxgenjs dependency for PowerPoint export"
```

---

### Task 2: Create export-pptx.js Script

**Files:**
- Create: `deckcraft/scripts/export-pptx.js`
- Reference: `deckcraft/scripts/export-pdf.js` (follow same patterns)

**Step 1: Create the export script**

Create `deckcraft/scripts/export-pptx.js`:

```javascript
#!/usr/bin/env node
/**
 * export-pptx.js - PowerPoint Export for DeckCraft Presentations
 *
 * Converts a DeckCraft presentation HTML file to PPTX format.
 * Uses Puppeteer to render each slide as PNG and embeds in PowerPoint.
 *
 * Usage: node export-pptx.js <presentation.html> [options]
 *
 * Options:
 *   --output, -o    Output PPTX path (default: same directory as input)
 *   --width         Viewport width (default: 1920)
 *   --height        Viewport height (default: 1080)
 *   --theme         Override theme (mesh|purple|cyan|emerald|orange|rose|blue|dark)
 */

const puppeteer = require('puppeteer');
const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
function parseArgs(args) {
    const options = {
        input: null,
        output: null,
        width: 1920,
        height: 1080,
        theme: null
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === '--output' || arg === '-o') {
            options.output = args[++i];
        } else if (arg === '--width') {
            options.width = parseInt(args[++i], 10);
        } else if (arg === '--height') {
            options.height = parseInt(args[++i], 10);
        } else if (arg === '--theme') {
            options.theme = args[++i];
        } else if (!arg.startsWith('-') && !options.input) {
            options.input = arg;
        }
    }

    return options;
}

async function exportPPTX(options) {
    // Validate input file
    if (!options.input) {
        console.error('Error: No input file specified');
        console.error('Usage: node export-pptx.js <presentation.html> [options]');
        process.exit(1);
    }

    // Resolve input path to absolute
    const inputPath = path.resolve(options.input);

    if (!fs.existsSync(inputPath)) {
        console.error(`Error: Input file not found: ${inputPath}`);
        process.exit(1);
    }

    // Determine output path
    const outputPath = options.output
        ? path.resolve(options.output)
        : inputPath.replace(/\.html$/i, '.pptx');

    console.log(`Exporting presentation to PowerPoint...`);
    console.log(`  Input:  ${inputPath}`);
    console.log(`  Output: ${outputPath}`);
    console.log(`  Resolution: ${options.width}x${options.height}`);

    // Launch browser
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security'
        ]
    });

    try {
        const page = await browser.newPage();

        // Set viewport for 16:9 aspect ratio (landscape)
        await page.setViewport({
            width: options.width,
            height: options.height,
            deviceScaleFactor: 1
        });

        // Load the presentation
        const fileUrl = `file://${inputPath}`;
        await page.goto(fileUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for presentation to initialize
        await page.waitForSelector('.slide', { timeout: 10000 });

        // Override theme if specified
        if (options.theme) {
            await page.evaluate((theme) => {
                if (typeof Presentation !== 'undefined' && Presentation.setTheme) {
                    Presentation.setTheme(theme);
                } else {
                    // Fallback: manually set body class
                    const currentProfile = document.body.className.match(/profile-\w+/)?.[0] || '';
                    document.body.className = `theme-${theme} ${currentProfile}`.trim();
                }
            }, options.theme);
        }

        // Hide UI elements for clean export
        await page.evaluate(() => {
            const elementsToHide = [
                '.nav',
                '.theme-switcher',
                '.profile-switcher',
                '.fullscreen-toggle',
                '.progress-bar',
                '.section-indicator'
            ];

            elementsToHide.forEach(selector => {
                const el = document.querySelector(selector);
                if (el) el.style.display = 'none';
            });
        });

        // Get total slide count
        const totalSlides = await page.evaluate(() => {
            if (typeof Presentation !== 'undefined' && Presentation.getTotalSlides) {
                return Presentation.getTotalSlides();
            }
            return document.querySelectorAll('.slide').length;
        });

        console.log(`  Slides: ${totalSlides}`);

        // Create PowerPoint presentation
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_16x9';
        pptx.title = 'DeckCraft Presentation';
        pptx.author = 'DeckCraft';

        // Capture each slide as PNG and add to PowerPoint
        for (let i = 0; i < totalSlides; i++) {
            console.log(`  Capturing slide ${i + 1}/${totalSlides}...`);

            // Navigate to slide
            await page.evaluate((slideIndex) => {
                if (typeof Presentation !== 'undefined' && Presentation.goToSlide) {
                    Presentation.goToSlide(slideIndex);
                } else {
                    // Fallback: manually switch slides
                    const slides = document.querySelectorAll('.slide');
                    slides.forEach((slide, idx) => {
                        slide.classList.toggle('active', idx === slideIndex);
                    });
                }
            }, i);

            // Wait for slide transition to complete
            await new Promise(resolve => setTimeout(resolve, 300));

            // Capture slide as PNG
            const screenshotBuffer = await page.screenshot({
                type: 'png',
                fullPage: false,
                clip: {
                    x: 0,
                    y: 0,
                    width: options.width,
                    height: options.height
                }
            });

            // Add slide to PowerPoint with image as background
            const slide = pptx.addSlide();
            slide.addImage({
                data: `image/png;base64,${screenshotBuffer.toString('base64')}`,
                x: 0,
                y: 0,
                w: '100%',
                h: '100%'
            });
        }

        // Write the PowerPoint file
        await pptx.writeFile({ fileName: outputPath });

        console.log(`\nPowerPoint exported successfully!`);
        console.log(`  ${outputPath}`);

    } finally {
        await browser.close();
    }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
DeckCraft PowerPoint Export

Usage: node export-pptx.js <presentation.html> [options]

Options:
  --output, -o <path>   Output PPTX path (default: same as input with .pptx extension)
  --width <pixels>      Viewport width (default: 1920)
  --height <pixels>     Viewport height (default: 1080)
  --theme <name>        Override theme (mesh|purple|cyan|emerald|orange|rose|blue|dark)
  --help, -h            Show this help message

Examples:
  node export-pptx.js presentation.html
  node export-pptx.js presentation.html -o output.pptx
  node export-pptx.js presentation.html --theme dark
`);
    process.exit(0);
}

const options = parseArgs(args);
exportPPTX(options).catch(err => {
    console.error('Export failed:', err.message);
    process.exit(1);
});
```

**Step 2: Make script executable**

Run: `chmod +x deckcraft/scripts/export-pptx.js`

**Step 3: Test the script with help flag**

Run: `node deckcraft/scripts/export-pptx.js --help`
Expected: Help message displayed with usage instructions

**Step 4: Test export with sample presentation**

Run: `node deckcraft/scripts/export-pptx.js presentations/tech-startup/output/presentation.html -o /tmp/test-export.pptx`
Expected:
- Console shows "Exporting presentation to PowerPoint..."
- Each slide captured with progress output
- "PowerPoint exported successfully!" message
- File exists at `/tmp/test-export.pptx`

**Step 5: Verify PPTX opens correctly**

Run: `open /tmp/test-export.pptx` (macOS) or manually open in PowerPoint
Expected: All slides visible with glassmorphism effects preserved

**Step 6: Commit**

```bash
git add deckcraft/scripts/export-pptx.js
git commit -m "feat: add PowerPoint export script

Renders slides as PNG images and embeds in PPTX using pptxgenjs.
Preserves pixel-perfect glassmorphism effects for sharing with
non-technical recipients."
```

---

### Task 3: Update SKILL.md Documentation

**Files:**
- Modify: `deckcraft/SKILL.md`

**Step 1: Add Export section to SKILL.md**

After the "### 4. Build" section (around line 96), add:

```markdown
### 5. Export (Optional)

Export presentations to other formats for sharing.

**PDF Export:**
```bash
node <skill>/scripts/export-pdf.js output/presentation.html
node <skill>/scripts/export-pdf.js output/presentation.html -o my-deck.pdf --page-numbers
```

**PowerPoint Export:**
```bash
node <skill>/scripts/export-pptx.js output/presentation.html
node <skill>/scripts/export-pptx.js output/presentation.html -o my-deck.pptx --theme dark
```

Both export scripts support:
- `--output, -o` - Custom output path
- `--width` - Viewport width (default: 1920)
- `--height` - Viewport height (default: 1080)
- `--theme` - Override presentation theme

**Note:** PowerPoint export renders slides as images to preserve glassmorphism effects. Recipients can view/present but not edit slide content.
```

**Step 2: Commit**

```bash
git add deckcraft/SKILL.md
git commit -m "docs: add export section to SKILL.md

Documents PDF and PowerPoint export options with usage examples."
```

---

### Task 4: Final Verification

**Step 1: Run full export test**

Run: `node deckcraft/scripts/export-pptx.js presentations/corporate/output/presentation.html -o /tmp/corporate-test.pptx`
Expected: Successful export with all slides

**Step 2: Test theme override**

Run: `node deckcraft/scripts/export-pptx.js presentations/academic/output/presentation.html -o /tmp/academic-dark.pptx --theme dark`
Expected: Export with dark theme applied

**Step 3: Verify error handling**

Run: `node deckcraft/scripts/export-pptx.js nonexistent.html`
Expected: "Error: Input file not found" message

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Add pptxgenjs dependency | `package.json` |
| 2 | Create export-pptx.js | `export-pptx.js` |
| 3 | Update SKILL.md | `SKILL.md` |
| 4 | Final verification | (testing only) |
