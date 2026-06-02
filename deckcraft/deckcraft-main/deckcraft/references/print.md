# Print Stylesheet

Generate clean, readable handouts from presentations via browser print.

## Printing

Use your browser's print function:
- **Ctrl+P** (Windows/Linux) or **Cmd+P** (macOS)
- All slides are shown vertically, one per page
- UI elements (nav, progress bar, theme switcher) are hidden
- Fragments are fully revealed
- Slide numbers are added automatically

## Print Preview

Add the `.print-ready` class to `<body>` to preview the print layout on screen:

```html
<body class="theme-mesh print-ready">
```

This shows all slides stacked vertically with dashed separators between them.

## What Changes in Print

| Element | Print Behavior |
|---------|---------------|
| Background | White |
| Text | Dark (#1a1a1a / #333) |
| Cards/containers | Light gray bg, no glassmorphism |
| Terminal/code | Stays dark for contrast |
| Nav/progress/UI | Hidden |
| Fragments | All visible |
| Animations | Disabled |
| Gradient text | Solid dark color |
| Links | URL shown in parentheses |
| Images | Constrained to page width |
| Slide numbers | Bottom-right of each page |

## Tips

- Code blocks and terminals keep their dark backgrounds for readability
- Cards and containers get a light gray background (#f5f5f5)
- Use `page-break-inside: avoid` on custom elements to prevent splitting across pages
- The print stylesheet is included automatically by the build system
