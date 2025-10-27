/**
 * Color Constants
 * All hardcoded color values should be defined here and imported where needed
 */

export const COLORS = {
        // Status Colors
        SUCCESS: '#4CAF50',
        ERROR: '#F44336',
        WARNING: '#FF9800',
        INFO: '#2196F3',

        // Primary/Theme Colors
        PRIMARY: '#4CAF50',
        PRIMARY_DARK: '#2E7D32',
        PRIMARY_LIGHT: '#66BB6A',

        // Background Colors
        BACKGROUND_LIGHT: '#FFFFFF',
        BACKGROUND_DARK: '#121212',
        BACKGROUND_SURFACE_DARK: '#232220',
        BACKGROUND_GRAY_LIGHT: '#E5E5E5',
        BACKGROUND_GRAY_DARK: '#252525',
        BACKGROUND_SURFACE_DARK_LOW: '#474747',
        BACKGROUND_SECONDARY: '#1A1A1A1A',

        // Text Colors
        TEXT_PRIMARY_LIGHT: '#000000',
        TEXT_PRIMARY_DARK: '#FFFFFF',
        TEXT_SECONDARY_LIGHT: '#666666',
        TEXT_SECONDARY_DARK: '#A0A0A0',
        TEXT_TERTIARY_LIGHT: '#999999',
        TEXT_TERTIARY_DARK: '#666666',
        TEXT_GRAY: '#CCCCCC',

        // Border Colors
        BORDER_LIGHT: '#000000',
        BORDER_DARK: '#333333',

        // Neutral Colors
        GRAY_100: '#CCCCCC',
        GRAY_200: '#E5E5E5',
        GRAY_300: '#9CA3AF',
        GRAY_400: '#9E9E9E',
        GRAY_500: '#666666',
        GRAY_600: '#374151',
        GRAY_700: '#666666',
        GRAY_800: '#999999',

        // Icon Colors
        ICON_LIGHT: '#FFFFFF',
        ICON_DARK: '#000000',
        ICON_GRAY: '#666666',
        ICON_GRAY_LIGHT: '#9CA3AF',
        ICON_GRAY_DARK: '#9E9E9E',

        // Shadow
        SHADOW: '#000000',

        // Spinner/Loader
        SPINNER_LIGHT: '#FFFFFF',
        SPINNER_PRIMARY: '#4CAF50',

        // Calendar
        CALENDAR_DARK_BG: '#252525',
        CALENDAR_DARK_TEXT: '#FFFFFF',
        CALENDAR_LIGHT_TEXT: '#000000',
} as const;

/**
 * Get color based on dark mode
 */
export const getThemeColor = (isDark: boolean) => {
        return {
                background: isDark ? COLORS.BACKGROUND_DARK : COLORS.BACKGROUND_LIGHT,
                textPrimary: isDark ? COLORS.TEXT_PRIMARY_DARK : COLORS.TEXT_PRIMARY_LIGHT,
                textSecondary: isDark ? COLORS.TEXT_SECONDARY_DARK : COLORS.TEXT_SECONDARY_LIGHT,
                textTertiary: isDark ? COLORS.TEXT_TERTIARY_DARK : COLORS.TEXT_TERTIARY_LIGHT,
                border: isDark ? COLORS.BORDER_DARK : COLORS.BORDER_LIGHT,
                iconPrimary: isDark ? COLORS.ICON_LIGHT : COLORS.ICON_DARK,
                iconSecondary: isDark ? COLORS.ICON_LIGHT : COLORS.ICON_GRAY,
        };
};
