/**
 * TRANSLATION SYSTEM USAGE EXAMPLES
 *
 * This file demonstrates various ways to use translations in the app
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useTranslation, useTranslatedText } from '../hooks/useTranslation';
import { TranslatedText } from '../components/ui/TranslatedText';
import { LanguageSelector } from '../components/LanguageSelector';

/**
 * METHOD 1: Use TranslatedText component for static text
 * (Text already exists in dictionary)
 */
export const Example1StaticText = () => {
        return (
                <View>
                        {/* Use staticKey=true for text that exists in dictionary */}
                        <TranslatedText text="welcome" staticKey={true} style={{ fontSize: 24 }} />
                        <TranslatedText text="login" staticKey={true} />
                        <TranslatedText text="email" staticKey={true} />
                </View>
        );
};

/**
 * METHOD 2: Use useTranslation hook for dynamic translation
 * (Text not in dictionary, needs translation via Google API)
 */
export const Example2DynamicTranslation = () => {
        const { t } = useTranslation();
        const [inputText, setInputText] = useState('');
        const [translatedText, setTranslatedText] = useState('');

        const handleTranslate = async () => {
                const result = await t(inputText);
                setTranslatedText(result);
        };

        return (
                <View>
                        <TextInput value={inputText} onChangeText={setInputText} placeholder="Enter text in English" />
                        <Button title="Translate" onPress={handleTranslate} />
                        <Text>{translatedText}</Text>
                </View>
        );
};

/**
 * METHOD 3: Use useTranslatedText hook for fixed text
 * (Hook automatically translates when language changes)
 */
export const Example3AutoTranslation = () => {
        const { text: welcomeMessage, isTranslating } = useTranslatedText(
                'Welcome to Calog! Track your calories and achieve your fitness goals.',
        );

        return <View>{isTranslating ? <Text>Translating...</Text> : <Text>{welcomeMessage}</Text>}</View>;
};

/**
 * METHOD 4: Integrate LanguageSelector
 */
export const Example4LanguageSelector = () => {
        return (
                <View>
                        <Text>Choose your language:</Text>

                        {/* Variant full: shows flag + name */}
                        <LanguageSelector variant="full" />

                        {/* Variant compact: shows flag only */}
                        <LanguageSelector variant="compact" />
                </View>
        );
};

/**
 * FULL EXAMPLE: Combining everything
 */
export const FullTranslationExample = () => {
        const { currentLanguage } = useTranslation();
        const { text: description } = useTranslatedText(
                'This app helps you track your daily calorie intake and fitness progress.',
        );

        return (
                <View style={{ padding: 20 }}>
                        {/* Language selector */}
                        <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
                                <LanguageSelector />
                        </View>

                        {/* Static translations */}
                        <TranslatedText
                                text="welcome"
                                staticKey={true}
                                style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}
                        />

                        {/* Dynamic translation */}
                        <Text style={{ marginBottom: 20 }}>{description}</Text>

                        {/* Current language info */}
                        <Text>Current language: {currentLanguage}</Text>

                        {/* More static text */}
                        <View style={{ marginTop: 20 }}>
                                <TranslatedText text="name" staticKey={true} />
                                <TranslatedText text="age" staticKey={true} />
                                <TranslatedText text="height" staticKey={true} />
                                <TranslatedText text="weight" staticKey={true} />
                        </View>
                </View>
        );
};
