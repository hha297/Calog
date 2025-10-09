import React from 'react';
import { TextStyle } from 'react-native';
import { CText } from './CText';
import { useLanguage } from '../../contexts';
import { getStaticTranslation } from '../../utils/translations';

export interface TranslatedTextProps {
        /**
         * Key in translation dictionary (for static translations)
         * OR English text (will use Google Translate API for dynamic translations)
         */
        text: string;
        /**
         * If true, will look up key in dictionary
         * If false, will return original text (use useTranslation hook for dynamic translation)
         */
        staticKey?: boolean;
        /**
         * Additional class names
         */
        className?: string;
        /**
         * Style object
         */
        style?: TextStyle;
        /**
         * Number of lines to display
         */
        numberOfLines?: number;
        /**
         * Font size variant (from CText)
         */
        size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
        /**
         * Font weight variant (from CText)
         */
        weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
        /**
         * Text alignment
         */
        align?: 'left' | 'center' | 'right';
        /**
         * Text color (className)
         */
        color?: string;
}

/**
 * Component Text with translation support
 * Use for static text already in dictionary
 * Uses CText internally for style consistency
 */
export const TranslatedText: React.FC<TranslatedTextProps> = ({
        text,
        staticKey = true,
        className,
        style,
        numberOfLines,
        size,
        weight,
        align,
        color,
}) => {
        const { currentLanguage } = useLanguage();

        const displayText = staticKey ? getStaticTranslation(text, currentLanguage) : text;

        return (
                <CText
                        className={className}
                        style={style}
                        numberOfLines={numberOfLines}
                        size={size}
                        weight={weight}
                        align={align}
                        color={color}
                >
                        {displayText}
                </CText>
        );
};
