import { Translate } from "@google-cloud/translate/build/src/v2";

// Initialize translation client
// You need to set up Google Cloud credentials
// https://cloud.google.com/translate/docs/setup
const translate = new Translate({
    projectId: "diplom-453311",
    key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
});

const translateService = {
    /**
     * Translates text from source language to target language
     * @param {string} text - Text to translate
     * @param {string} targetLanguage - Target language code (e.g., 'en' for English)
     * @param {string} sourceLanguage - Source language code (optional, auto-detect if not provided)
     */
    async translateText(text, targetLanguage = "en", sourceLanguage = "uz") {
        try {
            if (!text) return "";

            // For small texts, avoid unnecessary API calls
            if (text.length < 3) return text;

            const [translation] = await translate.translate(text, {
                from: sourceLanguage,
                to: targetLanguage,
            });

            return translation;
        } catch (error) {
            console.error("Translation error:", error);
            // Return original text if translation fails
            return text;
        }
    },

    /**
     * Translates an array of texts
     * @param {string[]} texts - Array of texts to translate
     * @param {string} targetLanguage - Target language code
     * @param {string} sourceLanguage - Source language code (optional)
     */
    async translateBatch(texts, targetLanguage = "en", sourceLanguage = "uz") {
        try {
            if (!texts || texts.length === 0) return [];

            // Filter out empty strings to avoid unnecessary API calls
            const nonEmptyTexts = texts.filter(
                (text) => text && text.length > 2
            );

            if (nonEmptyTexts.length === 0) return texts;

            const [translations] = await translate.translate(nonEmptyTexts, {
                from: sourceLanguage,
                to: targetLanguage,
            });

            // Reconstruct the original array, keeping empty strings as is
            return texts.map((text) => {
                if (!text || text.length <= 2) return text;
                const index = nonEmptyTexts.indexOf(text);
                return index >= 0 ? translations[index] : text;
            });
        } catch (error) {
            console.error("Batch translation error:", error);
            return texts;
        }
    },
};

export default translateService;
