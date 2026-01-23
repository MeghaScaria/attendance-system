/**
 * Translation System for Attendance System
 * Supports English (en) and Kannada (kn)
 */

class TranslationSystem {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = null;
        this.init();
    }

    async init() {
        try {
            const response = await fetch('/translations.json');
            this.translations = await response.json();
            this.applyLanguage(this.currentLanguage);
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to English if translations fail to load
            this.currentLanguage = 'en';
        }
    }

    /**
     * Get translation for a key
     * @param {string} key - Translation key (e.g., "common.dashboard")
     * @param {string} lang - Language code (optional, uses current language if not provided)
     * @returns {string} Translated text
     */
    t(key, lang = null) {
        const language = lang || this.currentLanguage;
        if (!this.translations || !this.translations[language]) {
            return key; // Return key if translation not found
        }

        const keys = key.split('.');
        let value = this.translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // Return key if path not found
            }
        }

        return typeof value === 'string' ? value : key;
    }

    /**
     * Apply language to the entire page
     * @param {string} lang - Language code ('en' or 'kn')
     */
    async applyLanguage(lang) {
        if (!this.translations || !this.translations[lang]) {
            console.error(`Language ${lang} not found in translations`);
            return;
        }

        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Translate all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.t(key, lang);
            
            // Handle different element types
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
                // Don't override placeholder if it has data-translate-placeholder
                if (!element.hasAttribute('data-translate-placeholder')) {
                    element.placeholder = translation;
                }
            } else if (element.tagName === 'INPUT' && element.type === 'submit' || element.tagName === 'BUTTON') {
                element.textContent = translation;
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Translate placeholder attributes
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            element.placeholder = this.t(key, lang);
        });

        // Translate title attributes
        document.querySelectorAll('[data-translate-title]').forEach(element => {
            const key = element.getAttribute('data-translate-title');
            element.title = this.t(key, lang);
        });

        // Trigger custom event for JavaScript files to update dynamic content
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Toggle between English and Kannada
     */
    toggleLanguage() {
        const newLang = this.currentLanguage === 'en' ? 'kn' : 'en';
        this.applyLanguage(newLang);
    }
}

// Initialize translation system globally
const i18n = new TranslationSystem();

// Make it available globally
window.i18n = i18n;
