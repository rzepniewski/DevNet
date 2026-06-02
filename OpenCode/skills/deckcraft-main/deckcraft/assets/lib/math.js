/**
 * MATH.JS - Math Equation Accessibility & KaTeX Integration
 *
 * Adds ARIA attributes to math elements for screen readers.
 * If KaTeX is loaded, auto-renders .katex-eq elements.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add aria attributes to math blocks for accessibility
    document.querySelectorAll('.math-block, .math').forEach(function(el) {
        if (!el.getAttribute('role')) {
            el.setAttribute('role', 'math');
        }
    });

    // If KaTeX is available, auto-render .katex-eq elements
    if (typeof katex !== 'undefined') {
        document.querySelectorAll('.katex-eq').forEach(function(el) {
            var tex = el.textContent;
            var displayMode = el.classList.contains('display');
            try {
                katex.render(tex, el, {
                    displayMode: displayMode,
                    throwOnError: false
                });
            } catch(e) {
                console.warn('KaTeX render error:', e);
            }
        });
    }
});
