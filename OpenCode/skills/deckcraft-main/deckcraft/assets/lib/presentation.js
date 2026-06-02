/**
 * PRESENTATION.JS - Reusable Slide Presentation Framework
 *
 * A modern presentation framework with theme switching, keyboard navigation,
 * touch support, and section indicators.
 *
 * USAGE:
 *   1. Include presentation.css in your HTML <head>
 *   2. Include this script at the end of <body>
 *   3. Call Presentation.init(config) after DOM is ready
 *
 * CONFIGURATION OPTIONS:
 *   {
 *     sections: ['intro', 'main', 'summary'],  // Section names for indicators
 *     defaultTheme: 'mesh',                     // Default theme (mesh|purple|cyan|emerald|orange|rose|blue|dark|light|warm|cool)
 *     defaultProfile: 'tech',                   // Default profile (tech|corporate|academic|creative)
 *     enableThemeSwitcher: true,                // Show theme switcher UI
 *     enableProfileSwitcher: true,              // Show profile switcher UI
 *     enableFullscreen: true,                   // Show fullscreen toggle button
 *     enableSectionIndicator: true,             // Show section dots on right
 *     enableProgressBar: true,                  // Show progress bar on top
 *     enableKeyboardNav: true,                  // Enable keyboard navigation
 *     enableTouchNav: true,                     // Enable touch/swipe navigation
 *     enableFragments: true,                    // Enable fragment/build animations
 *     transition: 'fade'                        // Slide transition: 'none', 'fade', 'slide', 'zoom'
 *   }
 *
 * REQUIRED HTML STRUCTURE:
 *   <body class="theme-mesh profile-tech">
 *     <div class="progress-bar" id="progress"></div>
 *     <div class="section-indicator" id="sectionIndicator"></div>
 *     <!-- Theme and profile switchers will be auto-generated if enabled -->
 *     <div class="presentation" id="presentation">
 *       <div class="slide active" data-section="intro">...</div>
 *       <div class="slide" data-section="main">...</div>
 *     </div>
 *     <nav class="nav">...</nav>
 *   </body>
 *
 * KEYBOARD SHORTCUTS:
 *   - Arrow Right / Space / Enter: Next slide
 *   - Arrow Left: Previous slide
 *   - Home: First slide
 *   - End: Last slide
 *   - T: Toggle theme panel
 *   - P: Toggle profile panel
 *   - F: Toggle fullscreen mode
 *
 * API METHODS:
 *   Presentation.init(config)      - Initialize the presentation
 *   Presentation.nextSlide()       - Go to next slide
 *   Presentation.prevSlide()       - Go to previous slide
 *   Presentation.goToSlide(index)  - Go to specific slide (0-indexed)
 *   Presentation.goToSection(name) - Go to first slide of section
 *   Presentation.setTheme(name)    - Change theme programmatically
 *   Presentation.setProfile(name)  - Change profile programmatically (tech|corporate|academic|creative)
 *   Presentation.setTransition(type) - Change transition type (none|fade|slide|zoom)
 *   Presentation.toggleFullscreen() - Toggle fullscreen mode
 *   Presentation.getCurrentSlide() - Get current slide index
 *   Presentation.getTotalSlides()  - Get total slide count
 */

const Presentation = (function() {
    'use strict';

    // State
    let currentSlide = 0;
    let slides = [];
    let totalSlides = 0;
    let sections = [];
    let currentTheme = 'mesh';
    let currentProfile = 'tech';
    let initialized = false;

    // Fragment state
    let fragmentIndex = -1;

    // Configuration
    let config = {
        sections: [],
        defaultTheme: 'mesh',
        defaultProfile: 'tech',
        enableThemeSwitcher: true,
        enableProfileSwitcher: true,
        enableFullscreen: true,
        enableSectionIndicator: true,
        enableProgressBar: true,
        enableKeyboardNav: true,
        enableTouchNav: true,
        enableFragments: true,
        transition: 'fade'
    };

    // DOM Elements
    let elements = {
        presentation: null,
        progress: null,
        sectionIndicator: null,
        slideCounter: null,
        prevBtn: null,
        nextBtn: null,
        themeToggle: null,
        themePanel: null,
        themeOptions: null,
        profileToggle: null,
        profilePanel: null,
        profileOptions: null,
        fullscreenToggle: null
    };

    // Touch tracking
    let touchStartX = 0;
    let touchEndX = 0;

    /**
     * Initialize the presentation
     * @param {Object} userConfig - Configuration options
     */
    function init(userConfig = {}) {
        // Prevent duplicate initialization
        if (initialized) {
            // Allow config updates without re-initializing
            if (Object.keys(userConfig).length > 0) {
                config = { ...config, ...userConfig };
            }
            return;
        }
        initialized = true;

        // Merge user config with defaults
        config = { ...config, ...userConfig };

        // Cache DOM elements
        elements.presentation = document.getElementById('presentation');
        elements.progress = document.getElementById('progress');
        elements.sectionIndicator = document.getElementById('sectionIndicator');
        elements.slideCounter = document.getElementById('slideCounter');
        elements.prevBtn = document.getElementById('prevBtn');
        elements.nextBtn = document.getElementById('nextBtn');

        // Get slides
        slides = document.querySelectorAll('.slide');
        totalSlides = slides.length;

        // Auto-detect sections if not provided
        if (config.sections.length === 0) {
            const sectionSet = new Set();
            slides.forEach(slide => {
                if (slide.dataset.section) {
                    sectionSet.add(slide.dataset.section);
                }
            });
            sections = Array.from(sectionSet);
        } else {
            sections = config.sections;
        }

        // Initialize components
        if (config.enableThemeSwitcher) {
            initThemeSwitcher();
        }

        if (config.enableProfileSwitcher) {
            initProfileSwitcher();
        }

        if (config.enableFullscreen) {
            initFullscreen();
        }

        if (config.enableSectionIndicator && sections.length > 0) {
            initSectionIndicators();
        }

        if (config.enableKeyboardNav) {
            initKeyboardNav();
        }

        if (config.enableTouchNav) {
            initTouchNav();
        }

        // Load saved theme or use default
        const savedTheme = localStorage.getItem('presentationTheme');
        setTheme(savedTheme || config.defaultTheme);

        // Load saved profile or use default
        const savedProfile = localStorage.getItem('presentationProfile');
        setProfile(savedProfile || config.defaultProfile);

        // Set transition class on body
        setTransition(config.transition);

        // Initial slide update
        updateSlide();
    }

    /**
     * Initialize theme switcher UI
     */
    function initThemeSwitcher() {
        // Check if theme switcher already exists
        let themeSwitcher = document.querySelector('.theme-switcher');

        if (!themeSwitcher) {
            // Create theme switcher HTML
            themeSwitcher = document.createElement('div');
            themeSwitcher.className = 'theme-switcher';
            themeSwitcher.innerHTML = `
                <button class="theme-toggle" id="themeToggle" title="Change theme (T)">
                    <svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                </button>
                <div class="theme-panel" id="themePanel">
                    <div class="theme-panel-title">Theme</div>
                    <div class="theme-options">
                        <button class="theme-option active" data-theme="mesh">
                            <div class="theme-swatch swatch-mesh"></div>
                            <span class="theme-name">Mesh</span>
                        </button>
                        <button class="theme-option" data-theme="purple">
                            <div class="theme-swatch swatch-purple"></div>
                            <span class="theme-name">Purple</span>
                        </button>
                        <button class="theme-option" data-theme="cyan">
                            <div class="theme-swatch swatch-cyan"></div>
                            <span class="theme-name">Cyan</span>
                        </button>
                        <button class="theme-option" data-theme="emerald">
                            <div class="theme-swatch swatch-emerald"></div>
                            <span class="theme-name">Emerald</span>
                        </button>
                        <button class="theme-option" data-theme="orange">
                            <div class="theme-swatch swatch-orange"></div>
                            <span class="theme-name">Orange</span>
                        </button>
                        <button class="theme-option" data-theme="rose">
                            <div class="theme-swatch swatch-rose"></div>
                            <span class="theme-name">Rose</span>
                        </button>
                        <button class="theme-option" data-theme="blue">
                            <div class="theme-swatch swatch-blue"></div>
                            <span class="theme-name">Blue</span>
                        </button>
                        <button class="theme-option" data-theme="dark">
                            <div class="theme-swatch swatch-dark"></div>
                            <span class="theme-name">Dark</span>
                        </button>
                        <button class="theme-option" data-theme="cisco">
                            <div class="theme-swatch swatch-cisco"></div>
                            <span class="theme-name">Cisco</span>
                        </button>
                        <button class="theme-option" data-theme="light">
                            <div class="theme-swatch swatch-light"></div>
                            <span class="theme-name">Light</span>
                        </button>
                        <button class="theme-option" data-theme="warm">
                            <div class="theme-swatch swatch-warm"></div>
                            <span class="theme-name">Warm</span>
                        </button>
                        <button class="theme-option" data-theme="cool">
                            <div class="theme-swatch swatch-cool"></div>
                            <span class="theme-name">Cool</span>
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(themeSwitcher);
        }

        // Cache elements
        elements.themeToggle = document.getElementById('themeToggle');
        elements.themePanel = document.getElementById('themePanel');
        elements.themeOptions = document.querySelectorAll('.theme-option');

        // Event listeners
        elements.themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.themePanel.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!elements.themePanel.contains(e.target) && !elements.themeToggle.contains(e.target)) {
                elements.themePanel.classList.remove('open');
            }
        });

        elements.themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                setTheme(option.dataset.theme);
                elements.themePanel.classList.remove('open');
            });
        });
    }

    /**
     * Initialize profile switcher UI
     */
    function initProfileSwitcher() {
        // Check if profile switcher already exists
        let profileSwitcher = document.querySelector('.profile-switcher');

        if (!profileSwitcher) {
            // Create profile switcher HTML
            profileSwitcher = document.createElement('div');
            profileSwitcher.className = 'profile-switcher';
            profileSwitcher.innerHTML = `
                <button class="profile-toggle" id="profileToggle" title="Change profile (P)">
                    <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </button>
                <div class="profile-panel" id="profilePanel">
                    <div class="profile-panel-title">Profile</div>
                    <div class="profile-options">
                        <button class="profile-option active" data-profile="tech">
                            <div class="profile-swatch swatch-tech"></div>
                            <span class="profile-name">Tech</span>
                        </button>
                        <button class="profile-option" data-profile="corporate">
                            <div class="profile-swatch swatch-corporate"></div>
                            <span class="profile-name">Corporate</span>
                        </button>
                        <button class="profile-option" data-profile="academic">
                            <div class="profile-swatch swatch-academic"></div>
                            <span class="profile-name">Academic</span>
                        </button>
                        <button class="profile-option" data-profile="creative">
                            <div class="profile-swatch swatch-creative"></div>
                            <span class="profile-name">Creative</span>
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(profileSwitcher);
        }

        // Cache elements
        elements.profileToggle = document.getElementById('profileToggle');
        elements.profilePanel = document.getElementById('profilePanel');
        elements.profileOptions = document.querySelectorAll('.profile-option');

        // Event listeners
        elements.profileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.profilePanel.classList.toggle('open');
            // Close theme panel if open
            if (elements.themePanel) {
                elements.themePanel.classList.remove('open');
            }
        });

        document.addEventListener('click', (e) => {
            if (!elements.profilePanel.contains(e.target) && !elements.profileToggle.contains(e.target)) {
                elements.profilePanel.classList.remove('open');
            }
        });

        elements.profileOptions.forEach(option => {
            option.addEventListener('click', () => {
                setProfile(option.dataset.profile);
                elements.profilePanel.classList.remove('open');
            });
        });
    }

    /**
     * Initialize fullscreen toggle UI
     */
    function initFullscreen() {
        // Check if fullscreen toggle already exists
        let fullscreenToggle = document.getElementById('fullscreenToggle');

        if (!fullscreenToggle) {
            // Create fullscreen toggle button
            fullscreenToggle = document.createElement('button');
            fullscreenToggle.className = 'fullscreen-toggle';
            fullscreenToggle.id = 'fullscreenToggle';
            fullscreenToggle.title = 'Toggle fullscreen (F)';
            fullscreenToggle.innerHTML = `
                <svg class="icon-expand" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                <svg class="icon-compress" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
            `;
            document.body.appendChild(fullscreenToggle);
        }

        // Cache element
        elements.fullscreenToggle = fullscreenToggle;

        // Event listener for toggle button
        elements.fullscreenToggle.addEventListener('click', toggleFullscreen);

        // Listen for fullscreen change to update button state
        document.addEventListener('fullscreenchange', updateFullscreenButton);
        document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
    }

    /**
     * Toggle fullscreen mode
     */
    function toggleFullscreen() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            // Enter fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    /**
     * Update fullscreen button state
     */
    function updateFullscreenButton() {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
        document.body.classList.toggle('is-fullscreen', !!isFullscreen);
    }

    /**
     * Initialize section indicator dots
     */
    function initSectionIndicators() {
        const container = elements.sectionIndicator;
        if (!container) return;

        container.innerHTML = '';
        sections.forEach((section) => {
            const dot = document.createElement('div');
            dot.className = 'section-dot';
            dot.dataset.section = section;
            dot.title = section.charAt(0).toUpperCase() + section.slice(1);
            dot.onclick = () => goToSection(section);
            container.appendChild(dot);
        });
    }

    /**
     * Initialize keyboard navigation
     */
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'Home') {
                e.preventDefault();
                goToSlide(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                goToSlide(totalSlides - 1);
            } else if (e.key === 't' || e.key === 'T') {
                if (elements.themePanel) {
                    elements.themePanel.classList.toggle('open');
                    // Close profile panel if open
                    if (elements.profilePanel) {
                        elements.profilePanel.classList.remove('open');
                    }
                }
            } else if (e.key === 'p' || e.key === 'P') {
                if (elements.profilePanel) {
                    elements.profilePanel.classList.toggle('open');
                    // Close theme panel if open
                    if (elements.themePanel) {
                        elements.themePanel.classList.remove('open');
                    }
                }
            } else if (e.key === 'f' || e.key === 'F') {
                if (config.enableFullscreen) {
                    toggleFullscreen();
                }
            }
        });
    }

    /**
     * Initialize touch/swipe navigation
     */
    function initTouchNav() {
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    /**
     * Handle swipe gesture
     */
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    /**
     * Update the visible slide and UI elements
     */
    function updateSlide() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'slide-enter', 'slide-exit');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });

        // Update counter
        if (elements.slideCounter) {
            elements.slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        }

        // Update navigation buttons
        if (elements.prevBtn) {
            elements.prevBtn.disabled = currentSlide === 0;
        }
        if (elements.nextBtn) {
            elements.nextBtn.disabled = currentSlide === totalSlides - 1;
        }

        // Update progress bar
        if (elements.progress && config.enableProgressBar) {
            elements.progress.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
        }

        // Update section indicator
        updateSectionIndicator();
    }

    /**
     * Update section indicator to highlight current section
     */
    function updateSectionIndicator() {
        if (!config.enableSectionIndicator || sections.length === 0) return;

        const currentSection = slides[currentSlide]?.dataset.section;
        document.querySelectorAll('.section-dot').forEach(dot => {
            dot.classList.toggle('active', dot.dataset.section === currentSection);
        });
    }

    /**
     * Get all fragment elements on a given slide
     * @param {number} slideIndex - Slide index
     * @returns {Element[]} Array of fragment elements in DOM order
     */
    function getSlideFragments(slideIndex) {
        if (slideIndex < 0 || slideIndex >= totalSlides) return [];
        return Array.from(slides[slideIndex].querySelectorAll('.fragment'));
    }

    /**
     * Reveal the next fragment on the current slide
     * @returns {boolean} True if a fragment was revealed, false if none remain
     */
    function revealNextFragment() {
        const fragments = getSlideFragments(currentSlide);
        if (fragments.length === 0) return false;

        const nextIndex = fragmentIndex + 1;
        if (nextIndex >= fragments.length) return false;

        // Handle highlight-current: dim previous fragments
        if (fragments[nextIndex].classList.contains('highlight-current')) {
            fragments.forEach((f, i) => {
                if (i < nextIndex && f.classList.contains('visible')) {
                    f.style.opacity = '0.4';
                }
            });
        }

        // If revealing after a highlight-current fragment, restore its opacity
        if (fragmentIndex >= 0 && fragments[fragmentIndex].classList.contains('highlight-current')) {
            fragments[fragmentIndex].style.opacity = '0.4';
        }

        fragments[nextIndex].classList.add('visible');
        fragments[nextIndex].style.opacity = '';
        fragmentIndex = nextIndex;
        return true;
    }

    /**
     * Hide the last revealed fragment on the current slide
     * @returns {boolean} True if a fragment was hidden, false if none were visible
     */
    function hidePrevFragment() {
        const fragments = getSlideFragments(currentSlide);
        if (fragments.length === 0 || fragmentIndex < 0) return false;

        fragments[fragmentIndex].classList.remove('visible');
        fragments[fragmentIndex].style.opacity = '';
        fragmentIndex--;

        // Restore highlight-current: if the now-last visible fragment is highlight-current, restore siblings
        if (fragmentIndex >= 0 && fragments[fragmentIndex].classList.contains('highlight-current')) {
            fragments.forEach((f, i) => {
                if (i < fragmentIndex && f.classList.contains('visible')) {
                    f.style.opacity = '0.4';
                }
            });
            fragments[fragmentIndex].style.opacity = '';
        } else if (fragmentIndex >= 0) {
            // Restore any dimmed fragments from a previous highlight-current
            fragments.forEach((f, i) => {
                if (i <= fragmentIndex && f.classList.contains('visible')) {
                    f.style.opacity = '';
                }
            });
        }

        return true;
    }

    /**
     * Reset all fragments on a given slide to hidden
     * @param {number} slideIndex - Slide index
     */
    function resetFragments(slideIndex) {
        const fragments = getSlideFragments(slideIndex);
        fragments.forEach(f => {
            f.classList.remove('visible');
            f.style.opacity = '';
        });
    }

    /**
     * Go to next slide
     */
    function nextSlide() {
        // Try to reveal next fragment first
        if (config.enableFragments && revealNextFragment()) {
            return;
        }

        if (currentSlide < totalSlides - 1) {
            navigateToSlide(currentSlide + 1, 'forward');
        }
    }

    /**
     * Go to previous slide
     */
    function prevSlide() {
        // Try to hide last fragment first
        if (config.enableFragments && hidePrevFragment()) {
            return;
        }

        if (currentSlide > 0) {
            navigateToSlide(currentSlide - 1, 'backward');
        }
    }

    /**
     * Navigate to a slide with transition direction
     * @param {number} index - Target slide index
     * @param {string} direction - 'forward' or 'backward'
     */
    function navigateToSlide(index, direction) {
        if (index < 0 || index >= totalSlides || index === currentSlide) return;

        const prevIndex = currentSlide;
        const transitionType = getTransitionForSlide(index) || getTransitionForSlide(prevIndex) || config.transition;

        if (transitionType === 'slide' || transitionType === 'zoom') {
            applyDirectionalTransition(prevIndex, index, direction, transitionType);
        } else {
            currentSlide = index;
            updateSlide();
        }

        // Reset fragments on newly navigated-to slide
        if (config.enableFragments) {
            resetFragments(index);
            fragmentIndex = -1;
        }
    }

    /**
     * Go to specific slide by index
     * @param {number} index - Slide index (0-based)
     */
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides && index !== currentSlide) {
            const direction = index > currentSlide ? 'forward' : 'backward';
            navigateToSlide(index, direction);
        }
    }

    /**
     * Get the transition type for a specific slide (per-slide override)
     * @param {number} slideIndex - Slide index
     * @returns {string|null} Transition type or null if no override
     */
    function getTransitionForSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= totalSlides) return null;
        return slides[slideIndex].dataset.transition || null;
    }

    /**
     * Apply a directional transition (slide or zoom)
     * @param {number} fromIndex - Current slide index
     * @param {number} toIndex - Target slide index
     * @param {string} direction - 'forward' or 'backward'
     * @param {string} type - Transition type ('slide' or 'zoom')
     */
    function applyDirectionalTransition(fromIndex, toIndex, direction, type) {
        const fromSlide = slides[fromIndex];
        const toSlide = slides[toIndex];

        // Set direction as data attribute for CSS to use
        document.body.dataset.transitionDirection = direction;

        // Add exit class to departing slide
        fromSlide.classList.add('slide-exit');

        // Add enter class to arriving slide
        toSlide.classList.add('slide-enter', 'active');

        // After transition completes, clean up (guarded against double-fire)
        let cleaned = false;
        const cleanup = () => {
            if (cleaned) return;
            cleaned = true;
            fromSlide.classList.remove('active', 'slide-exit');
            toSlide.classList.remove('slide-enter');
            delete document.body.dataset.transitionDirection;
            currentSlide = toIndex;
            updateSlideUI();
        };

        // Listen for transition end on the arriving slide
        const onEnd = () => {
            toSlide.removeEventListener('transitionend', onEnd);
            cleanup();
        };
        toSlide.addEventListener('transitionend', onEnd);

        // Safety timeout in case transitionend doesn't fire
        setTimeout(cleanup, 600);
    }

    /**
     * Update slide UI elements without touching slide classes (used after directional transitions)
     */
    function updateSlideUI() {
        // Update counter
        if (elements.slideCounter) {
            elements.slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        }

        // Update navigation buttons
        if (elements.prevBtn) {
            elements.prevBtn.disabled = currentSlide === 0;
        }
        if (elements.nextBtn) {
            elements.nextBtn.disabled = currentSlide === totalSlides - 1;
        }

        // Update progress bar
        if (elements.progress && config.enableProgressBar) {
            elements.progress.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;
        }

        // Update section indicator
        updateSectionIndicator();
    }

    /**
     * Set the slide transition type
     * @param {string} type - Transition type ('none', 'fade', 'slide', 'zoom')
     */
    function setTransition(type) {
        const validTypes = ['none', 'fade', 'slide', 'zoom'];
        if (!validTypes.includes(type)) return;

        // Remove old transition class
        document.body.classList.remove('transition-none', 'transition-fade', 'transition-slide', 'transition-zoom');
        // Add new one
        document.body.classList.add(`transition-${type}`);
        config.transition = type;
    }

    /**
     * Go to first slide of a section
     * @param {string} section - Section name
     */
    function goToSection(section) {
        for (let i = 0; i < slides.length; i++) {
            if (slides[i].dataset.section === section) {
                goToSlide(i);
                break;
            }
        }
    }

    /**
     * Set the presentation theme
     * @param {string} theme - Theme name (mesh|purple|cyan|emerald|orange|rose|blue|dark|light|warm|cool)
     */
    function setTheme(theme) {
        // Update body class preserving profile and transition classes
        document.body.className = `theme-${theme} profile-${currentProfile} transition-${config.transition}`;
        currentTheme = theme;

        // Update theme option UI
        if (elements.themeOptions) {
            elements.themeOptions.forEach(opt => {
                opt.classList.toggle('active', opt.dataset.theme === theme);
            });
        }

        // Persist theme
        localStorage.setItem('presentationTheme', theme);
    }

    /**
     * Set the presentation profile
     * @param {string} profile - Profile name (tech|corporate|academic|creative)
     */
    function setProfile(profile) {
        // Update body class preserving theme and transition classes
        document.body.className = `theme-${currentTheme} profile-${profile} transition-${config.transition}`;
        currentProfile = profile;

        // Update profile option UI
        if (elements.profileOptions) {
            elements.profileOptions.forEach(opt => {
                opt.classList.toggle('active', opt.dataset.profile === profile);
            });
        }

        // Persist profile
        localStorage.setItem('presentationProfile', profile);
    }

    /**
     * Get current slide index
     * @returns {number} Current slide index (0-based)
     */
    function getCurrentSlide() {
        return currentSlide;
    }

    /**
     * Get total slide count
     * @returns {number} Total number of slides
     */
    function getTotalSlides() {
        return totalSlides;
    }

    // Expose public methods globally for onclick handlers
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.goToSlide = goToSlide;

    // Public API
    return {
        init,
        nextSlide,
        prevSlide,
        goToSlide,
        goToSection,
        setTheme,
        setProfile,
        setTransition,
        toggleFullscreen,
        getCurrentSlide,
        getTotalSlides
    };
})();

// Auto-initialize when DOM is ready if data attribute is present
document.addEventListener('DOMContentLoaded', function() {
    const presentation = document.getElementById('presentation');
    if (presentation && presentation.dataset.autoInit !== 'false') {
        Presentation.init();
    }
});
