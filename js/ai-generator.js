/**
 * ============================================================================
 * AI MEME GENERATOR
 * Core meme generation logic with AI-like responses
 * ============================================================================
 */

class MemeGenerator {
    // Meme templates and data
    static memeTemplates = {
        classic: [
            { top: "When you realize it's Monday", bottom: "And you have 5 meetings" },
            { top: "My code when I press F5", bottom: "Suddenly works perfectly" },
            { top: "Me thinking about my life choices", bottom: "At 3 AM" },
        ],
        genZ: [
            { top: "It's giving main character energy", bottom: "No cap fr fr" },
            { top: "Tell me I'm wrong", bottom: "I'll wait" },
            { top: "The audacity", bottom: "Periodt" },
        ],
        darkHumor: [
            { top: "Therapist: Your fears aren't real", bottom: "My fears:" },
            { top: "Things could always be worse", bottom: "And probably will be" },
            { top: "Life hack:", bottom: "Just skip the living part" },
        ],
        gaming: [
            { top: "When you see an open chest", bottom: "Full of healing potions" },
            { top: "POV: You spent 2 hours in one area", bottom: "Still underleveled" },
            { top: "Me: doesn't pick the grenade", bottom: "Game: okay then" },
        ],
        programming: [
            { top: "Stack Overflow: How to do X", bottom: "Answer: Use Y library" },
            { top: "Code works on my machine", bottom: "Deploys to production" },
            { top: "// TODO: Fix this later", bottom: "Later = never" },
        ],
        history: [
            { top: "History class: We should remember this", bottom: "Humanity: Nah" },
            { top: "Average citizens 1945", bottom: "After learning about WW2" },
            { top: "Politicians promising change", bottom: "Same thing happens" },
        ],
    };

    static explanations = {
        classic: [
            "The timeless format of contrast between expectation and reality",
            "A simple yet effective meme demonstrating everyday struggles",
            "Relatable humor about common situations everyone faces",
        ],
        genZ: [
            "Modern slang combined with self-aware humor",
            "Contemporary meme language expressing skepticism",
            "Gen Z perspective on casual confidence",
        ],
        darkHumor: [
            "Humor that takes a darker, more cynical approach",
            "Self-deprecating wisdom wrapped in comedy",
            "Existential humor with a pessimistic twist",
        ],
        gaming: [
            "Relatable gaming moment that resonates with players",
            "Humor about common video game frustrations",
            "Inside joke shared by the gaming community",
        ],
        programming: [
            "Programmer humor about common coding struggles",
            "References to universal software development problems",
            "The irony of solving technical problems",
        ],
        history: [
            "Educational meme that highlights historical lessons",
            "Humor about humanity's tendency to repeat mistakes",
            "Commentary on how history shapes our present",
        ],
    };

    /**
     * Generate a meme
     * @param {string} topic - User's topic/idea
     * @param {string} style - Meme style
     * @param {string} template - Meme template
     * @returns {Promise<object>}
     */
    static async generateMeme(topic, style = 'classic', template = 'drake') {
        return new Promise((resolve) => {
            // Simulate AI processing delay
            setTimeout(() => {
                const styleKey = style || 'classic';
                const templates = this.memeTemplates[styleKey] || this.memeTemplates.classic;
                const memeTemplate = getRandomItem(templates);
                const explanation = getRandomItem(this.explanations[styleKey] || this.explanations.classic);

                // Generate title based on topic
                const title = this.generateTitle(topic, styleKey);
                const topText = memeTemplate.top;
                const bottomText = memeTemplate.bottom;

                const meme = {
                    id: generateId(),
                    topic,
                    style: styleKey,
                    template,
                    title,
                    topText,
                    bottomText,
                    explanation,
                    generatedAt: new Date().toISOString(),
                };

                trackEvent(CONFIG.events.MEME_GENERATED, { style: styleKey, template });
                resolve(meme);
            }, 800); // Simulate processing time
        });
    }

    /**
     * Generate meme title based on topic and style
     * @param {string} topic - Topic
     * @param {string} style - Style
     * @returns {string}
     */
    static generateTitle(topic, style) {
        const titles = {
            classic: [
                `${topic} be like`,
                `When ${topic}`,
                `${topic}: expectations vs reality`,
            ],
            genZ: [
                `${topic} energy`,
                `${topic}? Periodt`,
                `Tell me about ${topic}`,
            ],
            darkHumor: [
                `${topic}: The Truth`,
                `Why ${topic} won't save us`,
                `${topic} in a nutshell`,
            ],
            gaming: [
                `Gamers when ${topic}`,
                `POV: ${topic}`,
                `Every game with ${topic}`,
            ],
            programming: [
                `Developers when ${topic}`,
                `${topic}: Stack Overflow Edition`,
                `Code ${topic}`,
            ],
            history: [
                `History lesson: ${topic}`,
                `${topic} never gets old`,
                `${topic}: Humanity's favorite mistake`,
            ],
        };

        const titleList = titles[style] || titles.classic;
        return getRandomItem(titleList);
    }

    /**
     * Generate roast memes based on description
     * @param {string} description - User description
     * @returns {Promise<array>}
     */
    static async generateRoastMemes(description) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const roasts = [];
                const styles = Object.keys(CONFIG.memeStyles);

                for (let i = 0; i < 3; i++) {
                    const style = styles[i];
                    const templates = this.memeTemplates[style] || this.memeTemplates.classic;
                    const template = getRandomItem(templates);

                    roasts.push({
                        id: generateId(),
                        description,
                        style,
                        title: this.generateRoastTitle(description, style),
                        topText: `When someone says: "${description}"`,
                        bottomText: template.bottom,
                        explanation: `Roasted in ${CONFIG.memeStyles[style].name} style`,
                        timestamp: new Date().toISOString(),
                    });
                }

                trackEvent(CONFIG.events.ROAST_GENERATED, { descriptionLength: description.length });
                resolve(roasts);
            }, 1000);
        });
    }

    /**
     * Generate roast title
     * @param {string} description - Description
     * @param {string} style - Style
     * @returns {string}
     */
    static generateRoastTitle(description, style) {
        const shortDesc = description.substring(0, 20);
        return `Roasting "${shortDesc}..." in ${CONFIG.memeStyles[style].name}`;
    }

    /**
     * Generate random trending topics
     * @returns {array}
     */
    static generateTrendingTopics() {
        const topics = [
            "Debugging code at 2 AM",
            "When the WiFi disconnects",
            "Pretending to be busy in meetings",
            "Coffee is a personality trait",
            "Sleep is optional",
            "Monday = villain origin story",
            "Adulting is just Googling 'how to'",
            "My bed is made of magnets",
            "Procrastination level: expert",
            "Time flies when you're confused",
        ];

        return shuffleArray(topics).slice(0, 6);
    }

    /**
     * Get daily meme prompt
     * @returns {string}
     */
    static getDailyPrompt() {
        const prompts = [
            "What's the most relatable thing about your day?",
            "Describe your dream vs reality",
            "What's your superpower?",
            "If you were a meme, which one would you be?",
            "What's your biggest pet peeve?",
            "Describe your mood in meme language",
        ];

        return getRandomItem(prompts);
    }

    /**
     * Validate meme data
     * @param {object} memeData - Meme data
     * @returns {boolean}
     */
    static validateMeme(memeData) {
        return (
            memeData.title &&
            memeData.topText &&
            memeData.bottomText &&
            memeData.style
        );
    }

    /**
     * Generate meme variation
     * @param {object} baseMeme - Base meme
     * @returns {Promise<object>}
     */
    static async generateVariation(baseMeme) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const styleKey = baseMeme.style;
                const templates = this.memeTemplates[styleKey] || this.memeTemplates.classic;
                const newTemplate = getRandomItem(templates);

                const variation = {
                    ...baseMeme,
                    id: generateId(),
                    topText: newTemplate.top,
                    bottomText: newTemplate.bottom,
                    isVariation: true,
                    variationOf: baseMeme.id,
                };

                resolve(variation);
            }, 600);
        });
    }

    /**
     * Get meme recommendations
     * @param {string} style - Preferred style
     * @returns {array}
     */
    static getMemeRecommendations(style = 'classic') {
        const memes = MemeStorage.getAllMemes();
        const styleMemes = memes.filter(m => m.style === style);
        
        return styleMemes.slice(-5).reverse();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemeGenerator;
}
