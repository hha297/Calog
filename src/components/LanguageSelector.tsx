import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useLanguage, SupportedLanguage, LANGUAGE_NAMES, LANGUAGE_FLAGS } from '../contexts';

interface LanguageSelectorProps {
        /**
         * Button style
         */
        buttonStyle?: any;
        /**
         * Text style
         */
        textStyle?: any;
        /**
         * Display mode: compact (flag only) or full (flag + name)
         */
        variant?: 'compact' | 'full';
}

/**
 * Component for selecting app language
 * Displays a modal with a list of supported languages
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ buttonStyle, textStyle, variant = 'full' }) => {
        const { currentLanguage, setLanguage, isLoading } = useLanguage();
        const [modalVisible, setModalVisible] = useState(false);
        const [changingLanguage, setChangingLanguage] = useState(false);

        const languages: SupportedLanguage[] = ['en', 'fi', 'vi'];

        const handleLanguageChange = async (lang: SupportedLanguage) => {
                if (lang === currentLanguage) {
                        setModalVisible(false);
                        return;
                }

                setChangingLanguage(true);
                try {
                        await setLanguage(lang);
                        setModalVisible(false);
                } catch (error) {
                        console.error('Error changing language:', error);
                } finally {
                        setChangingLanguage(false);
                }
        };

        if (isLoading) {
                return <ActivityIndicator size="small" />;
        }

        return (
                <View>
                        <TouchableOpacity
                                style={[styles.button, buttonStyle]}
                                onPress={() => setModalVisible(true)}
                                disabled={changingLanguage}
                        >
                                <Text style={[styles.buttonText, textStyle]}>
                                        {LANGUAGE_FLAGS[currentLanguage]}{' '}
                                        {variant === 'full' && LANGUAGE_NAMES[currentLanguage]}
                                </Text>
                        </TouchableOpacity>

                        <Modal
                                animationType="fade"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => setModalVisible(false)}
                        >
                                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                                        <View style={styles.modalContent}>
                                                <Text style={styles.modalTitle}>Select Language</Text>

                                                {languages.map((lang) => (
                                                        <TouchableOpacity
                                                                key={lang}
                                                                style={[
                                                                        styles.languageOption,
                                                                        currentLanguage === lang &&
                                                                                styles.selectedLanguage,
                                                                ]}
                                                                onPress={() => handleLanguageChange(lang)}
                                                                disabled={changingLanguage}
                                                        >
                                                                <Text style={styles.flagText}>
                                                                        {LANGUAGE_FLAGS[lang]}
                                                                </Text>
                                                                <Text
                                                                        style={[
                                                                                styles.languageName,
                                                                                currentLanguage === lang &&
                                                                                        styles.selectedLanguageText,
                                                                        ]}
                                                                >
                                                                        {LANGUAGE_NAMES[lang]}
                                                                </Text>
                                                                {currentLanguage === lang && (
                                                                        <Text style={styles.checkmark}>✓</Text>
                                                                )}
                                                        </TouchableOpacity>
                                                ))}

                                                {changingLanguage && (
                                                        <ActivityIndicator style={styles.loader} size="small" />
                                                )}
                                        </View>
                                </Pressable>
                        </Modal>
                </View>
        );
};

const styles = StyleSheet.create({
        button: {
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: '#f0f0f0',
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
        },
        buttonText: {
                fontSize: 16,
                color: '#333',
        },
        modalOverlay: {
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
        },
        modalContent: {
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 20,
                width: '80%',
                maxWidth: 300,
        },
        modalTitle: {
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 20,
                textAlign: 'center',
                color: '#333',
        },
        languageOption: {
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                marginBottom: 8,
        },
        selectedLanguage: {
                backgroundColor: '#e3f2fd',
        },
        flagText: {
                fontSize: 24,
                marginRight: 12,
        },
        languageName: {
                fontSize: 16,
                flex: 1,
                color: '#333',
        },
        selectedLanguageText: {
                fontWeight: '600',
                color: '#1976d2',
        },
        checkmark: {
                fontSize: 18,
                color: '#1976d2',
                fontWeight: 'bold',
        },
        loader: {
                marginTop: 10,
        },
});
