/**
 * ============================================================================
 * UI MANAGER
 * Handles UI interactions, theme switching, and modal management
 * ============================================================================
 */

class UIManager {
    constructor() {
        this.init();
    }

    /**
     * Initialize UI manager
     */
    init() {
        this.setupThemeToggle();
        this.setupModalHandlers();
        this.setupKeyboardShortcuts();
        this.setupNavigationLinks();
        this.applyStoredTheme();
    }

    /**
     * Setup theme toggle
     */
    setupThemeToggle() {
        const themeToggle = $('#themeToggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const isDark = html.classList.contains('light-mode');

            if (isDark) {
                html.classList.remove('light-mode');
                PreferencesStorage.setTheme('dark');
                themeToggle.querySelector('.theme-icon').textContent = '🌙';
            } else {
                html.classList.add('light-mode');
                PreferencesStorage.setTheme('light');
                themeToggle.querySelector('.theme-icon').textContent = '☀️';
            }

            trackEvent(CONFIG.events.THEME_CHANGED);
            showToast(`Switched to ${isDark ? 'dark' : 'light'} mode`, 'success');
        });
    }

    /**
     * Apply stored theme
     */
    applyStoredTheme() {
        const theme = PreferencesStorage.getTheme();
        const html = document.documentElement;

        if (theme === 'light') {
            html.classList.add('light-mode');
        } else {
            html.classList.remove('light-mode');
        }
    }

    /**
     * Setup modal handlers
     */
    setupModalHandlers() {
        const modal = $('#memeModal');
        const modalClose = $('#modalClose');

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            const key = e.key.toLowerCase();

            if (e.ctrlKey || e.metaKey) {
                switch (key) {
                    case 'g':
                        e.preventDefault();
                        $('#generateBtn')?.click();
                        break;
                    case 's':
                        e.preventDefault();
                        $('#saveBtn')?.click();
                        break;
                    case 'd':
                        e.preventDefault();
                        $('#downloadBtn')?.click();
                        break;
                    case 'h':
                        e.preventDefault();
                        $('#shareBtn')?.click();
                        break;
                }
            }

            // Single key shortcuts
            switch (key) {
                case 'g':
                    scrollTo('#generator', 70);
                    break;
                case 'l':
                    scrollTo('#gallery', 70);
                    break;
                case 't':
                    scrollTo('#trending', 70);
                    break;
                case 'r':
                    scrollTo('#roast', 70);
                    break;
                case 'escape':
                    $('#memeModal').classList.remove('active');
                    break;
                case '?':
                    this.showKeyboardShortcuts();
                    break;
            }
        });
    }

    /**
     * Show keyboard shortcuts help
     */
    showKeyboardShortcuts() {
        const shortcuts = `
            🎹 Keyboard Shortcuts:
            
            Navigation:
            G - Generator
            L - Gallery
            T - Trending
            R - Roast Mode
            
            Quick Actions (Ctrl/Cmd):
            G - Generate Meme
            S - Save Meme
            D - Download
            H - Share
            
            General:
            ? - Show this help
            Esc - Close modals
        `;

        alert(shortcuts);
    }

    /**
     * Setup navigation links
     */
    setupNavigationLinks() {
        const navLinks = $$('.nav-link');
        navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href?.startsWith('#')) {
                    e.preventDefault();
                    scrollTo(href, 70);
                }
            });
        });
    }

    /**
     * Create toast notification (enhanced)
     * @param {string} message - Message
     * @param {string} type - Type
     * @param {number} duration - Duration
     */
    static createToast(message, type = 'info', duration = 3000) {
        showToast(message, type, duration);
    }

    /**
     * Show confirmation dialog
     * @param {string} message - Message
     * @returns {boolean}
     */
    static showConfirmation(message) {
        return confirm(message);
    }

    /**
     * Initialize form validation
     */
    static validateForm(formData) {
        if (!formData.topic || formData.topic.trim().length === 0) {
            showToast('Please enter a topic', 'error');
            return false;
        }

        if (formData.topic.length > CONFIG.limits.maxTopicLength) {
            showToast(`Topic must be less than ${CONFIG.limits.maxTopicLength} characters`, 'error');
            return false;
        }

        return true;
    }

    /**
     * Show loading spinner
     * @param {string} message - Message
     */
    static showSpinner(message = 'Loading...') {
        showLoading(message);
    }

    /**
     * Hide loading spinner
     */
    static hideSpinner() {
        hideLoading();
    }

    /**
     * Enable animations on scroll
     */
    static enableScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        });

        document.querySelectorAll('[data-animate]').forEach((el) => {
            observer.observe(el);
        });
    }

    /**
     * Create ripple effect on click
     * @param {Element} element - Element
     */
    static addRippleEffect(element) {
        element.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            element.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    }

    /**
     * Update UI based on device type
     */
    static updateForDevice() {
        if (isMobile()) {
            document.body.classList.add('is-mobile');
        } else if (isTablet()) {
            document.body.classList.add('is-tablet');
        }
    }

    /**
     * Show easter egg
     */
    static showEasterEgg() {
        const easterEggs = CONFIG.easterEggs.phrases;
        const egg = getRandomItem(easterEggs);
        showToast(`✨ ${egg}`, 'success', 2000);
    }

    /**
     * Initialize tooltips
     */
    static initializeTooltips() {
        const tooltipElements = $$('[title]');
        tooltipElements.forEach((el) => {
            el.addEventListener('mouseenter', (e) => {
                // Could implement custom tooltip here
            });
        });
    }

    /**
     * Handle viewport resize
     */
    static onViewportResize(callback) {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(callback, 250);
        });
    }
}

// Initialize UI manager globally
const uiManager = new UIManager();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
