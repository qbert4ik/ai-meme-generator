/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * Helper functions for common operations
 * ============================================================================
 */

/**
 * DOM Query Selectors
 */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/**
 * Create Element with classes and attributes
 * @param {string} tag - Element tag
 * @param {object} options - Options object
 * @returns {HTMLElement}
 */
function createElement(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.class) {
        element.className = Array.isArray(options.class) 
            ? options.class.join(' ') 
            : options.class;
    }
    
    if (options.id) element.id = options.id;
    if (options.text) element.textContent = options.text;
    if (options.html) element.innerHTML = options.html;
    
    if (options.attrs) {
        Object.entries(options.attrs).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    
    if (options.styles) {
        Object.entries(options.styles).forEach(([key, value]) => {
            element.style[key] = value;
        });
    }
    
    return element;
}

/**
 * Show Toast Notification
 * @param {string} message - Message text
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = CONFIG.ui.toastDuration) {
    const container = $('#toastContainer');
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
    };
    
    const toast = createElement('div', {
        class: ['toast', `toast-${type}`],
        html: `
            <span class="toast-icon">${icons[type]}</span>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">&times;</button>
        `,
    });
    
    container.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => toast.remove());
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, duration);
}

/**
 * Show Loading Overlay
 * @param {string} text - Loading text
 */
function showLoading(text = 'Loading...') {
    const overlay = $('#loadingOverlay');
    const loadingText = $('#loadingText');
    loadingText.textContent = text;
    overlay.classList.add('active');
}

/**
 * Hide Loading Overlay
 */
function hideLoading() {
    const overlay = $('#loadingOverlay');
    overlay.classList.remove('active');
}

/**
 * Debounce Function
 * @param {function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {function}
 */
function debounce(func, delay = CONFIG.ui.debounceDelay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle Function
 * @param {function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {function}
 */
function throttle(func, delay = CONFIG.ui.throttleDelay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

/**
 * Generate Random ID
 * @returns {string}
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format Date
 * @param {Date} date - Date object
 * @returns {string}
 */
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

/**
 * Copy to Clipboard
 * @param {string} text - Text to copy
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy to clipboard', 'error');
    }
}

/**
 * Download File
 * @param {string} url - File URL
 * @param {string} filename - Filename
 */
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Generate Random Color
 * @returns {string}
 */
function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Get Random Item from Array
 * @param {array} arr - Array
 * @returns {any}
 */
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle Array
 * @param {array} arr - Array to shuffle
 * @returns {array}
 */
function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Truncate Text
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string}
 */
function truncateText(text, length = 100) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

/**
 * Validate Email
 * @param {string} email - Email address
 * @returns {boolean}
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Check if Device is Mobile
 * @returns {boolean}
 */
function isMobile() {
    return window.innerWidth <= 640 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if Device is Tablet
 * @returns {boolean}
 */
function isTablet() {
    return window.innerWidth > 640 && window.innerWidth <= 1024;
}

/**
 * Get Browser Info
 * @returns {object}
 */
function getBrowserInfo() {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        onLine: navigator.onLine,
    };
}

/**
 * Play Sound
 * @param {string} type - Sound type: 'success', 'error', 'click'
 */
function playSound(type = 'click') {
    // Could use Web Audio API, for now just a visual feedback
    console.log(`Sound: ${type}`);
}

/**
 * Create Gradient Text
 * @param {string} text - Text
 * @param {string} gradient - Gradient name
 * @returns {HTMLElement}
 */
function createGradientText(text, gradient = 'primary') {
    const span = document.createElement('span');
    span.textContent = text;
    span.style.background = `var(--gradient-${gradient})`;
    span.style.backgroundClip = 'text';
    span.style.webkitBackgroundClip = 'text';
    span.style.webkitTextFillColor = 'transparent';
    return span;
}

/**
 * Scroll to Element
 * @param {string|HTMLElement} target - Selector or element
 * @param {number} offset - Offset in pixels
 */
function scrollTo(target, offset = 0) {
    const element = typeof target === 'string' ? $(target) : target;
    if (element) {
        window.scrollTo({
            top: element.offsetTop - offset,
            behavior: 'smooth',
        });
    }
}

/**
 * Add Event Listener with Auto-cleanup
 * @param {HTMLElement} element - Element
 * @param {string} event - Event name
 * @param {function} handler - Event handler
 * @returns {function} - Removal function
 */
function on(element, event, handler) {
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
}

/**
 * Safe JSON Parse
 * @param {string} json - JSON string
 * @param {any} fallback - Fallback value
 * @returns {any}
 */
function safeJsonParse(json, fallback = null) {
    try {
        return JSON.parse(json);
    } catch (err) {
        console.error('JSON Parse Error:', err);
        return fallback;
    }
}

/**
 * Deep Clone Object
 * @param {object} obj - Object to clone
 * @returns {object}
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge Objects
 * @param {object} target - Target object
 * @param {object} source - Source object
 * @returns {object}
 */
function mergeObjects(target, source) {
    return { ...target, ...source };
}

/**
 * Wait/Sleep
 * @param {number} ms - Milliseconds
 * @returns {Promise}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if Element is in Viewport
 * @param {HTMLElement} element - Element
 * @returns {boolean}
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
    );
}

/**
 * Track Analytics Event (if backend exists)
 * @param {string} eventName - Event name
 * @param {object} data - Event data
 */
function trackEvent(eventName, data = {}) {
    console.log(`Event: ${eventName}`, data);
    // Could send to analytics service
}
