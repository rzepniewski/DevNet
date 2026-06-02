/**
 * COMPONENTS-EXTRA.JS - Extended Component Interactivity
 *
 * Provides JavaScript for interactive components:
 *   - Tabbed Content: Click-based tab switching
 *
 * Requires: components-extra.css
 * Load after presentation.js in your HTML.
 */

document.addEventListener('DOMContentLoaded', function () {
    // --- Tabbed Content ---
    document.querySelectorAll('.tabs-container').forEach(function (container) {
        var buttons = container.querySelectorAll('.tab-btn');
        var panels = container.querySelectorAll('.tab-panel');

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var tabId = btn.dataset.tab;

                // Deactivate all
                buttons.forEach(function (b) { b.classList.remove('active'); });
                panels.forEach(function (p) { p.classList.remove('active'); });

                // Activate selected
                btn.classList.add('active');
                var target = container.querySelector('.tab-panel[data-tab="' + tabId + '"]');
                if (target) {
                    target.classList.add('active');
                }
            });
        });
    });
});
