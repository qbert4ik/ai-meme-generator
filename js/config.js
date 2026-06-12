/**
 * ============================================================================
 * CONFIGURATION & CONSTANTS
 * Global configuration for the AI Meme Generator
 * ============================================================================
 */

const CONFIG = {
    // API Configuration
    api: {
        baseUrl: 'http://localhost:3000/api',
        timeout: 10000,
    },

    // Meme Styles
    memeStyles: {
        classic: {
            name: 'Classic Internet Meme',
            icon: '😆',
            description: 'Classic meme format style',
        },
        genZ: {
            name: 'Gen Z Meme',
            icon: '🤡',
            description: 'Modern Gen Z humor',
        },
        darkHumor: {
            name: 'Dark Humor',
            icon: '💀',
            description: 'Dark and edgy memes',
        },
        gaming: {
            name: 'Gaming Meme',
            icon: '🎮',
            description: 'Gaming-related memes',
        },
        programming: {
            name: 'Programming Meme',
            icon: '💻',
            description: 'Programmer humor',
        },
        history: {
            name: 'History Meme',
            icon: '📚',
            description: 'Historical references',
        },
    },

    // Meme Templates
    templates: {
        drake: {
            name: 'Drake',
            width: 500,
            height: 500,
            positions: {
                top: { x: 250, y: 100 },
                bottom: { x: 250, y: 400 },
            },
        },
        boyfriend: {
            name: 'Distracted Boyfriend',
            width: 600,
            height: 400,
            positions: {
                top: { x: 400, y: 100 },
                bottom: { x: 150, y: 200 },
            },
        },
        brain: {
            name: 'Expanding Brain',
            width: 500,
            height: 600,
            positions: {
                top: { x: 250, y: 150 },
                bottom: { x: 250, y: 500 },
            },
        },
        cat: {
            name: 'Woman Yelling at Cat',
            width: 500,
            height: 400,
            positions: {
                top: { x: 100, y: 200 },
                bottom: { x: 400, y: 200 },
            },
        },
        buttons: {
            name: 'Two Buttons',
            width: 400,
            height: 500,
            positions: {
                top: { x: 150, y: 150 },
                bottom: { x: 250, y: 400 },
            },
        },
    },

    // Storage Keys
    storage: {
        savedMemes: 'meme_generator_saved_memes',
        likedMemes: 'meme_generator_liked_memes',
        theme: 'meme_generator_theme',
        userPreferences: 'meme_generator_preferences',
        trendingMemes: 'meme_generator_trending_memes',
        dailyMeme: 'meme_generator_daily_meme',
    },

    // UI Settings
    ui: {
        toastDuration: 3000,
        animationDuration: 300,
        debounceDelay: 300,
        throttleDelay: 500,
    },

    // Limits
    limits: {
        maxMemes: 100,
        maxTopicLength: 200,
        maxFileSize: 5 * 1024 * 1024, // 5MB
    },

    // Keyboard Shortcuts
    shortcuts: {
        generate: 'g',
        save: 's',
        download: 'd',
        share: 'h',
        edit: 'e',
        gallery: 'l',
        roast: 'r',
    },

    // Easter Eggs
    easterEggs: {
        phrases: [
            'much wow, so meme',
            'to infinity and beyond',
            'i am once again asking',
            'this is fine',
            'let that sink in',
            'stonks',
            'panik',
            'kalm',
        ],
        triggers: ['press f', 'oof', 'big brain', 'no cap'],
    },

    // Default Themes
    themes: {
        dark: {
            name: 'Dark',
            colorScheme: 'dark',
        },
        light: {
            name: 'Light',
            colorScheme: 'light',
        },
    },

    // Analytics Events (for tracking if backend exists)
    events: {
        MEME_GENERATED: 'meme_generated',
        MEME_SAVED: 'meme_saved',
        MEME_LIKED: 'meme_liked',
        MEME_DOWNLOADED: 'meme_downloaded',
        MEME_SHARED: 'meme_shared',
        THEME_CHANGED: 'theme_changed',
        ROAST_GENERATED: 'roast_generated',
    },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
