import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SupportedLanguage = 'en' | 'fi' | 'vi';

export interface LanguageContextType {
        currentLanguage: SupportedLanguage;
        setLanguage: (lang: SupportedLanguage) => Promise<void>;
        isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@calog:language';

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
        en: 'English',
        fi: 'Suomi',
        vi: 'Tiếng Việt',
};

export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
        en: '🇬🇧',
        fi: '🇫🇮',
        vi: '🇻🇳',
};

interface LanguageProviderProps {
        children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
        const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
                loadLanguage();
        }, []);

        const loadLanguage = async () => {
                try {
                        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
                        if (savedLanguage && ['en', 'fi', 'vi'].includes(savedLanguage)) {
                                setCurrentLanguage(savedLanguage as SupportedLanguage);
                        }
                } catch (error) {
                        console.error('Error loading language:', error);
                } finally {
                        setIsLoading(false);
                }
        };

        const setLanguage = async (lang: SupportedLanguage) => {
                try {
                        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
                        setCurrentLanguage(lang);
                } catch (error) {
                        console.error('Error saving language:', error);
                        throw error;
                }
        };

        return (
                <LanguageContext.Provider value={{ currentLanguage, setLanguage, isLoading }}>
                        {children}
                </LanguageContext.Provider>
        );
};

export const useLanguage = (): LanguageContextType => {
        const context = useContext(LanguageContext);
        if (!context) {
                throw new Error('useLanguage must be used within a LanguageProvider');
        }
        return context;
};
