/**
 * ============================================================================
 * MAIN APPLICATION
 * Core app initialization and event handling
 * ============================================================================
 */

class MemeGeneratorApp {
    constructor() {
        this.currentMeme = null;
        this.selectedStyle = 'classic';
        this.selectedTemplate = 'drake';
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('🎭 AI Meme Generator Starting...');
        
        this.setupEventListeners();
        this.setupGeneratorPanel();
        this.setupRoastMode();
        this.setupTrendingSection();
        this.setupHeroActions();
        this.enableScrollAnimations();
        
        // Load initial data
        this.loadInitialData();
        
        // Show welcome message
        showToast('Welcome to AI Meme Generator! 🎉', 'success', 5000);
        
        console.log('✅ App initialized successfully');
    }

    /**
     * Setup generator panel events
     */
    setupGeneratorPanel() {
        const generateBtn = $('#generateBtn');
        const topicInput = $('#topicInput');
        const saveBtn = $('#saveBtn');
        const likeBtn = $('#likeBtn');
        const downloadBtn = $('#downloadBtn');
        const shareBtn = $('#shareBtn');

        // Style selection
        const styleBtns = $$('.style-btn');
        styleBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                styleBtns.forEach((b) => b.classList.remove('active'));
                e.target.closest('.style-btn').classList.add('active');
                this.selectedStyle = e.target.closest('.style-btn').dataset.style;
            });
        });

        // Template selection
        const templateBtns = $$('.template-btn');
        templateBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                templateBtns.forEach((b) => b.classList.remove('active'));
                e.target.closest('.template-btn').classList.add('active');
                this.selectedTemplate = e.target.closest('.template-btn').dataset.template;
            });
        });

        // Generate button
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateMeme());
        }

        // Save button
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveMeme());
        }

        // Like button
        if (likeBtn) {
            likeBtn.addEventListener('click', () => this.toggleLike());
        }

        // Download button
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadMeme());
        }

        // Share button
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareMeme());
        }
    }

    /**
     * Setup roast mode
     */
    setupRoastMode() {
        const roastBtn = $('#roastBtn');
        if (roastBtn) {
            roastBtn.addEventListener('click', () => this.generateRoastMemes());
        }
    }

    /**
     * Setup trending section
     */
    setupTrendingSection() {
        this.renderTrendingMemes();
    }

    /**
     * Setup hero actions
     */
    setupHeroActions() {
        const randomMemeBtn = $('#randomMemeBtn');
        if (randomMemeBtn) {
            randomMemeBtn.addEventListener('click', () => this.generateRandomMeme());
        }
    }

    /**
     * Setup main event listeners
     */
    setupEventListeners() {
        // Handle modal close
        const modal = $('#memeModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal?.classList.remove('active');
            }
        });
    }

    /**
     * Generate meme
     */
    async generateMeme() {
        const topicInput = $('#topicInput');
        const topic = topicInput?.value.trim();

        // Validate input
        if (!UIManager.validateForm({ topic })) {
            return;
        }

        // Show loading
        UIManager.showSpinner('✨ Generating your meme...');

        try {
            // Generate meme using AI generator
            this.currentMeme = await MemeGenerator.generateMeme(
                topic,
                this.selectedStyle,
                this.selectedTemplate
            );

            // Render the meme
            this.renderMemePreview();

            // Update panel status
            const panelStatus = $('#panelStatus');
            if (panelStatus) {
                panelStatus.textContent = '✅ Generated';
            }

            showToast('Meme generated! 🎉', 'success');
        } catch (err) {
            console.error('Generate error:', err);
            showToast('Failed to generate meme', 'error');
        } finally {
            UIManager.hideSpinner();
        }
    }

    /**
     * Render meme preview
     */
    renderMemePreview() {
        const previewContainer = $('#previewContainer');
        const generatedContent = $('#generatedContent');

        if (!this.currentMeme) return;

        // Render canvas
        CanvasRenderer.renderMeme(this.currentMeme, 'previewContainer');

        // Show generated content
        if (generatedContent) {
            $('#memeTitle').textContent = this.currentMeme.title;
            $('#memeTopText').textContent = this.currentMeme.topText;
            $('#memeBottomText').textContent = this.currentMeme.bottomText;
            $('#memeExplanation').textContent = this.currentMeme.explanation;
            generatedContent.style.display = 'block';
        }

        // Load for editing
        memeEditor.loadMeme(this.currentMeme);
    }

    /**
     * Save meme
     */
    saveMeme() {
        if (!this.currentMeme) {
            showToast('Generate a meme first', 'error');
            return;
        }

        try {
            const savedMeme = MemeStorage.saveMeme(this.currentMeme);
            this.currentMeme.id = savedMeme.id;
            
            // Update gallery
            galleryManager.renderGallery();
            
            showToast('Meme saved! 💾', 'success');
        } catch (err) {
            console.error('Save error:', err);
            showToast('Failed to save meme', 'error');
        }
    }

    /**
     * Toggle like
     */
    toggleLike() {
        if (!this.currentMeme || !this.currentMeme.id) {
            showToast('Save the meme first', 'error');
            return;
        }

        MemeStorage.toggleLike(this.currentMeme.id);
        const likeBtn = $('#likeBtn');
        if (likeBtn) {
            likeBtn.classList.toggle('active');
        }
    }

    /**
     * Download meme
     */
    downloadMeme() {
        if (!this.currentMeme) {
            showToast('Generate a meme first', 'error');
            return;
        }

        CanvasRenderer.exportAsImage('previewContainer', `meme-${Date.now()}.png`);
    }

    /**
     * Share meme
     */
    shareMeme() {
        if (!this.currentMeme) {
            showToast('Generate a meme first', 'error');
            return;
        }

        const shareText = `Check out this meme! "${this.currentMeme.topText}" / "${this.currentMeme.bottomText}"`;

        if (navigator.share) {
            navigator.share({
                title: this.currentMeme.title,
                text: shareText,
            }).catch((err) => console.log('Share error:', err));
        } else {
            copyToClipboard(shareText);
        }

        trackEvent(CONFIG.events.MEME_SHARED, { 
            memeId: this.currentMeme.id,
            style: this.currentMeme.style 
        });
    }

    /**
     * Generate random meme
     */
    async generateRandomMeme() {
        const randomTopic = getRandomItem(MemeGenerator.generateTrendingTopics());
        const topicInput = $('#topicInput');
        
        if (topicInput) {
            topicInput.value = randomTopic;
        }

        this.selectedStyle = getRandomItem(Object.keys(CONFIG.memeStyles));
        this.selectedTemplate = getRandomItem(Object.keys(CONFIG.templates));

        // Update UI
        $$('.style-btn').forEach((btn) => btn.classList.remove('active'));
        $$(`.style-btn[data-style="${this.selectedStyle}"]`).forEach((btn) => {
            btn.classList.add('active');
        });

        await this.generateMeme();
    }

    /**
     * Generate roast memes
     */
    async generateRoastMemes() {
        const roastInput = $('#roastInput');
        const description = roastInput?.value.trim();

        if (!description || description.length === 0) {
            showToast('Please describe yourself', 'error');
            return;
        }

        UIManager.showSpinner('🔥 Roasting you with memes...');

        try {
            const roasts = await MemeGenerator.generateRoastMemes(description);
            this.renderRoastMemes(roasts);
            
            const roastResults = $('#roastResults');
            if (roastResults) {
                roastResults.style.display = 'block';
            }

            showToast('Your roast is ready! 🔥', 'success');
        } catch (err) {
            console.error('Roast error:', err);
            showToast('Failed to generate roast', 'error');
        } finally {
            UIManager.hideSpinner();
        }
    }

    /**
     * Render roast memes
     */
    renderRoastMemes(roasts) {
        const roastMemesGrid = $('#roastMemes');
        if (!roastMemesGrid) return;

        roastMemesGrid.innerHTML = '';

        roasts.forEach((roast) => {
            const card = createElement('div', {
                class: 'roast-meme-card',
            });

            card.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 15px;">🎭</div>
                    <h4 style="margin-bottom: 10px; color: var(--color-text-primary);">${roast.title}</h4>
                    <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 10px;">"${roast.topText}"</p>
                    <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 15px;">"${roast.bottomText}"</p>
                    <small style="color: var(--color-text-muted);">${roast.style}</small>
                </div>
                <div style="padding: 0 20px 20px; display: flex; gap: 10px;">
                    <button class="btn btn-primary btn-sm" style="flex: 1;">Save</button>
                    <button class="btn btn-secondary btn-sm" style="flex: 1;">Share</button>
                </div>
            `;

            card.querySelector('.btn-primary').addEventListener('click', () => {
                this.currentMeme = roast;
                this.saveMeme();
            });

            card.querySelector('.btn-secondary').addEventListener('click', () => {
                this.currentMeme = roast;
                this.shareMeme();
            });

            roastMemesGrid.appendChild(card);
        });
    }

    /**
     * Render trending memes
     */
    renderTrendingMemes() {
        const trendingGrid = $('#trendingGrid');
        if (!trendingGrid) return;

        const trending = TrendingStorage.getTrendingMemes();

        trendingGrid.innerHTML = '';

        trending.forEach((meme) => {
            const card = createElement('div', {
                class: 'trending-card',
            });

            card.innerHTML = `
                <div class="trending-image">
                    <div style="display: flex; flex-direction: column; justify-content: center; height: 100%; text-align: center; color: var(--color-text-muted);">
                        <div style="font-size: 48px; margin-bottom: 10px;">🔥</div>
                        <div style="font-weight: bold;">${meme.title}</div>
                    </div>
                </div>
                <div class="trending-content">
                    <div class="trending-title">${truncateText(meme.title, 30)}</div>
                    <div class="trending-stats">
                        <span class="trending-stat">👁️ ${meme.views}</span>
                        <span class="trending-stat">❤️ ${meme.likes}</span>
                    </div>
                    <div class="trending-actions">
                        <button class="trending-btn view-btn">View</button>
                        <button class="trending-btn use-btn">Use</button>
                    </div>
                </div>
            `;

            card.querySelector('.use-btn').addEventListener('click', () => {
                const topicInput = $('#topicInput');
                if (topicInput) {
                    topicInput.value = meme.title.replace('Trending: ', '');
                    this.selectedStyle = meme.style;
                    this.generateMeme();
                }
            });

            trendingGrid.appendChild(card);
        });
    }

    /**
     * Load initial data
     */
    loadInitialData() {
        // Load daily meme
        const dailyMeme = TrendingStorage.getDailyMeme();
        if (dailyMeme) {
            console.log('📅 Daily meme:', dailyMeme.title);
        }

        // Load saved memes count
        const savedMemes = MemeStorage.getAllMemes();
        console.log(`📁 Saved memes: ${savedMemes.length}`);

        // Load user preferences
        const theme = PreferencesStorage.getTheme();
        console.log(`🎨 Theme: ${theme}`);
    }

    /**
     * Enable scroll animations
     */
    enableScrollAnimations() {
        UIManager.enableScrollAnimations();
    }

    /**
     * Handle app errors globally
     */
    static handleError(error) {
        console.error('App error:', error);
        showToast('An error occurred. Please try again.', 'error');
    }

    /**
     * Check browser compatibility
     */
    static checkCompatibility() {
        const features = {
            localStorage: typeof localStorage !== 'undefined',
            sessionStorage: typeof sessionStorage !== 'undefined',
            fetch: typeof fetch !== 'undefined',
            clipboard: navigator.clipboard !== undefined,
        };

        Object.entries(features).forEach(([feature, available]) => {
            if (!available) {
                console.warn(`⚠️ ${feature} not available`);
            }
        });
    }
}

/**
 * Initialize app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check compatibility
    MemeGeneratorApp.checkCompatibility();

    // Initialize app
    const app = new MemeGeneratorApp();

    // Expose app globally for debugging
    window.app = app;
    window.storage = {
        MemeStorage,
        PreferencesStorage,
        TrendingStorage,
    };

    console.log('🚀 AI Meme Generator is ready!');
    console.log('💡 Tip: Press ? to see keyboard shortcuts');
});

/**
 * Handle app errors
 */
window.addEventListener('error', (e) => {
    MemeGeneratorApp.handleError(e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    MemeGeneratorApp.handleError(e.reason);
});

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemeGeneratorApp;
}
