/**
 * ============================================================================
 * GALLERY MODULE
 * Manages meme gallery display and interactions
 * ============================================================================
 */

class GalleryManager {
    constructor() {
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.currentSearch = '';
        this.init();
    }

    /**
     * Initialize gallery
     */
    init() {
        this.setupEventListeners();
        this.renderGallery();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search input
        const searchInput = $('#searchInput');
        if (searchInput) {
            searchInput.addEventListener(
                'input',
                debounce((e) => {
                    this.currentSearch = e.target.value;
                    this.renderGallery();
                })
            );
        }

        // Sort buttons
        const sortButtons = $$('.sort-btn');
        sortButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                sortButtons.forEach((b) => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentSort = e.target.dataset.sort;
                this.renderGallery();
            });
        });

        // Filter buttons
        const filterButtons = $$('.filter-btn');
        filterButtons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach((b) => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderGallery();
            });
        });
    }

    /**
     * Render gallery
     */
    renderGallery() {
        const galleryGrid = $('#galleryGrid');
        if (!galleryGrid) return;

        let memes = MemeStorage.getAllMemes();

        // Apply search filter
        if (this.currentSearch) {
            memes = memes.filter((m) =>
                m.title.toLowerCase().includes(this.currentSearch.toLowerCase()) ||
                m.topText.toLowerCase().includes(this.currentSearch.toLowerCase())
            );
        }

        // Apply sort
        memes = MemeStorage.getMemesSorted(this.currentSort);

        // Render memes
        if (memes.length === 0) {
            galleryGrid.innerHTML = `
                <div class="gallery-empty" style="grid-column: 1/-1;">
                    <span class="empty-icon">📭</span>
                    <p>No memes found</p>
                    <small>Create and save your first meme!</small>
                </div>
            `;
            return;
        }

        galleryGrid.innerHTML = '';
        memes.forEach((meme) => {
            const memeCard = this.createMemeCard(meme);
            galleryGrid.appendChild(memeCard);
        });
    }

    /**
     * Create meme card
     * @param {object} meme - Meme data
     * @returns {HTMLElement}
     */
    createMemeCard(meme) {
        const card = createElement('div', {
            class: 'gallery-item',
        });

        const likedMemes = StorageManager.get(CONFIG.storage.likedMemes, []);
        const isLiked = likedMemes.includes(meme.id);

        card.innerHTML = `
            <div class="gallery-image">
                <div style="text-align: center; color: #999;">
                    <div style="font-size: 48px; margin-bottom: 10px;">🎭</div>
                    <div style="font-size: 14px; font-weight: bold;">${meme.title}</div>
                </div>
            </div>
            <div class="gallery-info">
                <div class="gallery-title">${truncateText(meme.title, 50)}</div>
                <div class="gallery-meta">
                    <span>${formatDate(meme.createdAt)}</span>
                    <span>${meme.likes || 0} ❤️</span>
                </div>
                <div class="gallery-actions">
                    <button class="gallery-action-btn view-btn" title="View">👁️</button>
                    <button class="gallery-action-btn like-btn ${isLiked ? 'active' : ''}" title="Like">❤️</button>
                    <button class="gallery-action-btn download-btn" title="Download">📥</button>
                    <button class="gallery-action-btn delete-btn" title="Delete">🗑️</button>
                </div>
            </div>
        `;

        // Event listeners
        card.querySelector('.view-btn').addEventListener('click', () =>
            this.openMemeModal(meme)
        );
        card.querySelector('.like-btn').addEventListener('click', () => {
            MemeStorage.toggleLike(meme.id);
            this.renderGallery();
        });
        card.querySelector('.download-btn').addEventListener('click', () =>
            this.downloadMeme(meme)
        );
        card.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Delete this meme?')) {
                MemeStorage.deleteMeme(meme.id);
                this.renderGallery();
            }
        });

        return card;
    }

    /**
     * Open meme modal
     * @param {object} meme - Meme data
     */
    openMemeModal(meme) {
        const modal = $('#memeModal');
        if (!modal) return;

        $('#modalTitle').textContent = meme.title;
        $('#modalDescription').textContent = meme.explanation || 'A great meme!';
        $('#modalDate').textContent = formatDate(meme.createdAt);
        $('#modalLikes').textContent = `${meme.likes || 0} ❤️`;

        // Set modal image
        const modalImage = $('#modalImage');
        modalImage.innerHTML = `
            <div style="text-align: center; color: #999; display: flex; flex-direction: column; justify-content: center; height: 100%;">
                <div style="font-size: 72px; margin-bottom: 20px;">🎭</div>
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${meme.title}</div>
                <div style="font-size: 14px; margin: 10px 0;">"${meme.topText}"</div>
                <div style="font-size: 14px; margin: 10px 0;">"${meme.bottomText}"</div>
            </div>
        `;

        // Setup action buttons
        $('#modalDownloadBtn').onclick = () => this.downloadMeme(meme);
        $('#modalShareBtn').onclick = () => this.shareMeme(meme);
        $('#modalDeleteBtn').onclick = () => {
            if (confirm('Delete this meme?')) {
                MemeStorage.deleteMeme(meme.id);
                modal.classList.remove('active');
                this.renderGallery();
                showToast('Meme deleted', 'info');
            }
        };

        modal.classList.add('active');
    }

    /**
     * Download meme
     * @param {object} meme - Meme data
     */
    downloadMeme(meme) {
        // Create temporary canvas
        const tempContainer = document.createElement('div');
        CanvasRenderer.renderMeme(meme, '');
        const canvas = tempContainer.querySelector('.meme-canvas-wrapper');

        // Convert to image and download
        if (typeof html2canvas !== 'undefined') {
            html2canvas(canvas || tempContainer).then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `meme-${meme.id}.png`;
                link.click();
                showToast('Meme downloaded! 📥', 'success');
            });
        } else {
            showToast('Download feature requires html2canvas library', 'info');
        }
    }

    /**
     * Share meme
     * @param {object} meme - Meme data
     */
    shareMeme(meme) {
        const shareText = `Check out this meme: ${meme.title} - "${meme.topText}" / "${meme.bottomText}"`;

        if (navigator.share) {
            navigator.share({
                title: meme.title,
                text: shareText,
            }).catch((err) => console.log('Share error:', err));
        } else {
            copyToClipboard(shareText);
        }

        trackEvent(CONFIG.events.MEME_SHARED, { memeId: meme.id });
        showToast('Meme shared! 📤', 'success');
    }

    /**
     * Export all memes
     */
    exportAllMemes() {
        const data = MemeStorage.exportMemes();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `memes-export-${Date.now()}.json`;
        link.click();
        showToast('Memes exported! 📦', 'success');
    }

    /**
     * Import memes
     */
    importMemes() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                MemeStorage.importMemes(event.target.result);
                this.renderGallery();
            };
            reader.readAsText(file);
        };
        input.click();
    }
}

// Initialize gallery globally
const galleryManager = new GalleryManager();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalleryManager;
}
