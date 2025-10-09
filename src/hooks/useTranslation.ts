import { useState, useEffect, useCallback } from 'react';
import { useTranslator } from 'react-native-translator';
import { useLanguage } from '../contexts';

/**
 * Hook to translate text according to current language
 */
export const useTranslation = () => {
        const { translate } = useTranslator();
        const { currentLanguage } = useLanguage();

        /**
         * Translate a string from English to current language
         * @param text - English string to translate
         * @returns Translated string
         */
        const t = useCallback(
                async (text: string): Promise<string> => {
                        // If current language is English, no need to translate
                        if (currentLanguage === 'en' || !text) {
                                return text;
                        }

                        try {
                                const result = await translate('en', currentLanguage, text, {
                                        type: 'google',
                                        timeout: 5000,
                                });
                                return result || text;
                        } catch (error) {
                                console.error('Translation error:', error);
                                return text; // Fallback to original text if error
                        }
                },
                [currentLanguage, translate],
        );

        return { t, currentLanguage };
};

/**
 * Hook to translate a fixed text and cache the result
 * @param sourceText - Source text (English)
 */
export const useTranslatedText = (sourceText: string) => {
        const { t, currentLanguage } = useTranslation();
        const [translatedText, setTranslatedText] = useState(sourceText);
        const [isTranslating, setIsTranslating] = useState(false);

        useEffect(() => {
                const translateText = async () => {
                        if (currentLanguage === 'en') {
                                setTranslatedText(sourceText);
                                return;
                        }

                        setIsTranslating(true);
                        try {
                                const result = await t(sourceText);
                                setTranslatedText(result);
                        } catch (error) {
                                console.error('Translation error:', error);
                                setTranslatedText(sourceText);
                        } finally {
                                setIsTranslating(false);
                        }
                };

                translateText();
        }, [sourceText, currentLanguage, t]);

        return { text: translatedText, isTranslating };
};
