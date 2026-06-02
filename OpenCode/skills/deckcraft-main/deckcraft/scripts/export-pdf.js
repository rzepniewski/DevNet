#!/usr/bin/env node
/**
 * export-pdf.js - PDF Export for DeckCraft Presentations
 *
 * Converts a DeckCraft presentation HTML file to PDF format.
 * Uses Puppeteer to render each slide and combine into a single PDF.
 *
 * Usage: node export-pdf.js <presentation.html> [options]
 *
 * Options:
 *   --output, -o    Output PDF path (default: same directory as input)
 *   --width         Viewport width (default: 1920)
 *   --height        Viewport height (default: 1080)
 *   --page-numbers  Add page numbers to PDF (default: false)
 *   --theme         Override theme (mesh|purple|cyan|emerald|orange|rose|blue|dark|light|warm|cool)
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Auto-install dependencies if not present
const scriptDir = __dirname;
try {
    require.resolve('puppeteer', { paths: [scriptDir] });
} catch {
    console.log('Installing dependencies (one-time setup)...');
    execSync('npm install', { cwd: scriptDir, stdio: 'inherit' });
    console.log('Dependencies installed.\n');
}

const puppeteer = require(require.resolve('puppeteer', { paths: [scriptDir] }));

// Parse command line arguments
function parseArgs(args) {
    const options = {
        input: null,
        output: null,
        width: 1920,
        height: 1080,
        pageNumbers: false,
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
        } else if (arg === '--page-numbers') {
            options.pageNumbers = true;
        } else if (arg === '--theme') {
            options.theme = args[++i];
        } else if (!arg.startsWith('-') && !options.input) {
            options.input = arg;
        }
    }

    return options;
}

async function exportPDF(options) {
    // Validate input file
    if (!options.input) {
        console.error('Error: No input file specified');
        console.error('Usage: node export-pdf.js <presentation.html> [options]');
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
        : inputPath.replace(/\.html$/i, '.pdf');

    console.log(`Exporting presentation to PDF...`);
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

        // Hide UI elements and prepare for PDF export
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
            style.id = 'pdf-export-overrides';
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

            // Ensure print-friendly backgrounds
            document.body.style.webkitPrintColorAdjust = 'exact';
            document.body.style.printColorAdjust = 'exact';
        });

        // Get total slide count
        const totalSlides = await page.evaluate(() => {
            return document.querySelectorAll('.slide').length;
        });

        console.log(`  Slides: ${totalSlides}`);

        // Use screenshots (not page.pdf) to avoid @media print overrides
        // that force all slides visible simultaneously
        const { PDFDocument } = require(require.resolve('pdf-lib', { paths: [scriptDir] }));
        const pdfDoc = await PDFDocument.create();

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

            // Add page number if enabled
            if (options.pageNumbers) {
                await page.evaluate((current, total) => {
                    // Remove existing page number
                    const existing = document.getElementById('pdf-page-number');
                    if (existing) existing.remove();

                    const pageNum = document.createElement('div');
                    pageNum.id = 'pdf-page-number';
                    pageNum.style.cssText = `
                        position: fixed;
                        bottom: 20px;
                        right: 30px;
                        font-size: 14px;
                        color: rgba(255,255,255,0.6);
                        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                        z-index: 9999;
                    `;
                    pageNum.textContent = `${current + 1} / ${total}`;
                    document.body.appendChild(pageNum);
                }, i, totalSlides);
            }

            // Screenshot the slide (uses screen rendering, not print)
            const pngBuffer = await page.screenshot({ type: 'png', fullPage: false });

            // Embed screenshot as a full-page PDF page
            const pngImage = await pdfDoc.embedPng(pngBuffer);
            const pdfPage = pdfDoc.addPage([options.width, options.height]);
            pdfPage.drawImage(pngImage, {
                x: 0,
                y: 0,
                width: options.width,
                height: options.height
            });
        }

        const finalPdf = await pdfDoc.save();

        // Write the final PDF
        fs.writeFileSync(outputPath, finalPdf);

        console.log(`\nPDF exported successfully!`);
        console.log(`  ${outputPath}`);

    } finally {
        await browser.close();
    }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
DeckCraft PDF Export

Usage: node export-pdf.js <presentation.html> [options]

Options:
  --output, -o <path>   Output PDF path (default: same as input with .pdf extension)
  --width <pixels>      Viewport width (default: 1920)
  --height <pixels>     Viewport height (default: 1080)
  --page-numbers        Add page numbers to slides
  --theme <name>        Override theme (mesh|purple|cyan|emerald|orange|rose|blue|dark|light|warm|cool)
  --help, -h            Show this help message

Examples:
  node export-pdf.js presentation.html
  node export-pdf.js presentation.html -o output.pdf
  node export-pdf.js presentation.html --theme dark --page-numbers
`);
    process.exit(0);
}

const options = parseArgs(args);
exportPDF(options).catch(err => {
    console.error('Export failed:', err.message);
    process.exit(1);
});
