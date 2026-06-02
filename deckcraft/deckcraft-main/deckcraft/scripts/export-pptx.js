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
 *   --theme         Override theme (mesh|purple|cyan|emerald|orange|rose|blue|dark|light|warm|cool)
 *   --help, -h      Show this help message
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Auto-install dependencies if not present
const scriptDir = __dirname;
try {
    require.resolve('puppeteer', { paths: [scriptDir] });
    require.resolve('pptxgenjs', { paths: [scriptDir] });
} catch {
    console.log('Installing dependencies (one-time setup)...');
    execSync('npm install', { cwd: scriptDir, stdio: 'inherit' });
    console.log('Dependencies installed.\n');
}

const puppeteer = require(require.resolve('puppeteer', { paths: [scriptDir] }));
const PptxGenJS = require(require.resolve('pptxgenjs', { paths: [scriptDir] }));

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

        // Hide UI elements and prepare for export
        await page.evaluate(() => {
            // Hide navigation, theme switcher, fullscreen toggle, etc.
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

            // Disable all transitions/animations for instant slide switching
            const style = document.createElement('style');
            style.id = 'pptx-export-overrides';
            style.textContent = `
                *, *::before, *::after {
                    transition: none !important;
                    animation: none !important;
                }
                .slide {
                    transition: none !important;
                }
                .fragment {
                    opacity: 1 !important;
                    transform: none !important;
                    transition: none !important;
                }
            `;
            document.head.appendChild(style);
        });

        // Get total slide count
        const totalSlides = await page.evaluate(() => {
            if (typeof Presentation !== 'undefined' && Presentation.getTotalSlides) {
                return Presentation.getTotalSlides();
            }
            return document.querySelectorAll('.slide').length;
        });

        if (totalSlides === 0) {
            console.error('Error: No slides found in the presentation');
            process.exit(1);
        }

        console.log(`  Slides: ${totalSlides}`);

        // Create PowerPoint presentation
        const pptx = new PptxGenJS();

        // Set slide dimensions (16:9 aspect ratio)
        // pptxgenjs uses inches, so we calculate based on standard 10" x 5.625" (16:9)
        pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
        pptx.layout = 'CUSTOM';

        // Capture each slide as PNG and add to PowerPoint
        for (let i = 0; i < totalSlides; i++) {
            console.log(`  Capturing slide ${i + 1}/${totalSlides}...`);

            // Directly switch slides — bypass Presentation.goToSlide() which
            // uses animated transitions and resets fragments to hidden
            await page.evaluate((slideIndex) => {
                const slides = document.querySelectorAll('.slide');
                slides.forEach((slide, idx) => {
                    if (idx === slideIndex) {
                        slide.classList.add('active');
                        slide.style.opacity = '1';
                        slide.style.visibility = 'visible';
                        slide.style.transform = 'none';
                        // Reveal all fragments on this slide
                        slide.querySelectorAll('.fragment').forEach(f => {
                            f.classList.add('visible');
                            f.style.opacity = '1';
                            f.style.transform = 'none';
                        });
                    } else {
                        slide.classList.remove('active');
                        slide.style.opacity = '0';
                        slide.style.visibility = 'hidden';
                    }
                });
            }, i);

            // Brief wait for repaint
            await new Promise(resolve => setTimeout(resolve, 100));

            // Capture slide as PNG
            const screenshotBuffer = await page.screenshot({
                type: 'png',
                fullPage: false
            });

            // Convert buffer to base64 for pptxgenjs
            const base64Image = screenshotBuffer.toString('base64');

            // Add slide with image as full background
            const slide = pptx.addSlide();
            slide.addImage({
                data: `image/png;base64,${base64Image}`,
                x: 0,
                y: 0,
                w: '100%',
                h: '100%'
            });
        }

        // Save the PowerPoint file
        console.log(`  Generating PowerPoint file...`);
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
  --theme <name>        Override theme (mesh|purple|cyan|emerald|orange|rose|blue|dark|light|warm|cool)
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
