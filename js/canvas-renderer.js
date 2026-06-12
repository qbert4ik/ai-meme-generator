/**
 * ============================================================================
 * CANVAS RENDERER
 * Handles rendering memes on canvas with text
 * ============================================================================
 */

class CanvasRenderer {
    /**
     * Render meme on canvas
     * @param {object} memeData - Meme data
     * @param {string} containerId - Container element ID
     */
    static renderMeme(memeData, containerId = 'memeCanvas') {
        const container = $(`#${containerId}`);
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // Create canvas wrapper
        const wrapper = createElement('div', {
            class: 'meme-canvas-wrapper',
            styles: {
                position: 'relative',
                width: '500px',
                height: '400px',
                background: 'white',
                margin: '0 auto',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            },
        });

        // Add template background
        const background = createElement('div', {
            class: 'meme-background',
            styles: {
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                boxSizing: 'border-box',
                position: 'relative',
            },
        });

        // Add top text
        const topTextEl = this.createTextElement(
            memeData.topText,
            'top',
            memeData.topTextStyle
        );
        background.appendChild(topTextEl);

        // Add middle content
        const middle = createElement('div', {
            styles: {
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '72px',
                textAlign: 'center',
            },
            text: memeData.emoji || '🎭',
        });
        background.appendChild(middle);

        // Add bottom text
        const bottomTextEl = this.createTextElement(
            memeData.bottomText,
            'bottom',
            memeData.bottomTextStyle
        );
        background.appendChild(bottomTextEl);

        wrapper.appendChild(background);
        container.appendChild(wrapper);

        return wrapper;
    }

    /**
     * Create text element with styling
     * @param {string} text - Text content
     * @param {string} position - 'top' or 'bottom'
     * @param {object} style - Text style
     * @returns {HTMLElement}
     */
    static createTextElement(text, position = 'top', style = {}) {
        const textEl = createElement('div', {
            class: `meme-text meme-text-${position}`,
            text: text,
            styles: {
                fontSize: style.fontSize || '32px',
                fontWeight: style.fontWeight || 'bold',
                color: style.color || '#ffffff',
                textAlign: 'center',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                padding: '10px',
                fontFamily: 'Impact, Arial, sans-serif',
                lineHeight: '1.2',
                wordWrap: 'break-word',
                cursor: 'move',
                ...style,
            },
        });

        return textEl;
    }

    /**
     * Export canvas as image
     * @param {string} containerId - Container ID
     * @param {string} filename - Filename
     */
    static async exportAsImage(containerId = 'memeCanvas', filename = 'meme.png') {
        try {
            const element = $(`#${containerId}`);
            if (!element) throw new Error('Container not found');

            // Use html2canvas if available, otherwise fallback
            if (typeof html2canvas !== 'undefined') {
                const canvas = await html2canvas(element, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                });
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = filename;
                link.click();
                
                trackEvent(CONFIG.events.MEME_DOWNLOADED, { filename });
                showToast('Meme downloaded! 📥', 'success');
            } else {
                // Fallback: copy as data URL
                showToast('Use screenshot feature instead', 'info');
            }
        } catch (err) {
            console.error('Export error:', err);
            showToast('Failed to export meme', 'error');
        }
    }

    /**
     * Copy canvas content to clipboard
     * @param {string} containerId - Container ID
     */
    static async copyToClipboard(containerId = 'memeCanvas') {
        try {
            const element = $(`#${containerId}`);
            if (!element) throw new Error('Container not found');

            if (typeof html2canvas !== 'undefined') {
                const canvas = await html2canvas(element);
                canvas.toBlob((blob) => {
                    navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob }),
                    ]);
                    showToast('Meme copied to clipboard! 📋', 'success');
                    trackEvent(CONFIG.events.MEME_DOWNLOADED);
                });
            } else {
                showToast('Copy feature not available', 'info');
            }
        } catch (err) {
            console.error('Copy error:', err);
            showToast('Failed to copy meme', 'error');
        }
    }

    /**
     * Generate meme thumbnail
     * @param {object} memeData - Meme data
     * @returns {string} Data URL
     */
    static generateThumbnail(memeData) {
        const tempContainer = document.createElement('div');
        tempContainer.style.display = 'none';
        document.body.appendChild(tempContainer);

        const styles = {
            width: '200px',
            height: '150px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: '10px',
            boxSizing: 'border-box',
            position: 'relative',
        };

        tempContainer.innerHTML = `
            <div style="font-size: 14px; font-weight: bold; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); text-align: center; line-height: 1.2;">
                ${memeData.topText}
            </div>
            <div style="font-size: 40px; text-align: center;">
                🎭
            </div>
            <div style="font-size: 14px; font-weight: bold; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); text-align: center; line-height: 1.2;">
                ${memeData.bottomText}
            </div>
        `;

        Object.entries(styles).forEach(([key, value]) => {
            tempContainer.style[key] = value;
        });

        const dataUrl = tempContainer.innerHTML;
        document.body.removeChild(tempContainer);

        return dataUrl;
    }

    /**
     * Create preset templates
     * @param {string} templateName - Template name
     * @returns {object}
     */
    static getTemplatePreset(templateName = 'drake') {
        const presets = {
            drake: {
                name: 'Drake',
                description: 'Drake approval meme',
                layout: 'vertical-split',
                textPositions: {
                    top: { x: '50%', y: '25%' },
                    bottom: { x: '50%', y: '75%' },
                },
            },
            boyfriend: {
                name: 'Distracted Boyfriend',
                description: 'Comparison meme',
                layout: 'horizontal-split',
                textPositions: {
                    left: { x: '20%', y: '50%' },
                    right: { x: '80%', y: '50%' },
                },
            },
            brain: {
                name: 'Expanding Brain',
                description: 'Escalation meme',
                layout: 'vertical-stack',
                textPositions: {
                    level1: { x: '50%', y: '20%' },
                    level2: { x: '50%', y: '40%' },
                    level3: { x: '50%', y: '60%' },
                    level4: { x: '50%', y: '80%' },
                },
            },
        };

        return presets[templateName] || presets.drake;
    }

    /**
     * Apply text styling to canvas
     * @param {string} containerId - Container ID
     * @param {object} styling - Styling options
     */
    static applyTextStyling(containerId, styling) {
        const container = $(`#${containerId}`);
        if (!container) return;

        const textElements = container.querySelectorAll('.meme-text');
        textElements.forEach((el) => {
            if (styling.fontSize) el.style.fontSize = `${styling.fontSize}px`;
            if (styling.color) el.style.color = styling.color;
            if (styling.fontWeight) el.style.fontWeight = styling.fontWeight;
        });
    }

    /**
     * Generate SVG meme (alternative format)
     * @param {object} memeData - Meme data
     * @returns {string} SVG string
     */
    static generateSVG(memeData) {
        const svg = `
            <svg width="500" height="400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="500" height="400" fill="url(#grad)"/>
                <text x="250" y="80" font-size="32" font-weight="bold" fill="white" text-anchor="middle" font-family="Impact, Arial">
                    ${memeData.topText}
                </text>
                <text x="250" y="350" font-size="32" font-weight="bold" fill="white" text-anchor="middle" font-family="Impact, Arial">
                    ${memeData.bottomText}
                </text>
            </svg>
        `;

        return svg;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CanvasRenderer;
}
