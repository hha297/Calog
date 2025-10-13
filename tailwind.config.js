/** @type {import('tailwindcss').Config} */
module.exports = {
        // Enable dark mode with class strategy (NativeWind v4 uses this)
        darkMode: 'class',
        content: [
                './App.{js,jsx,ts,tsx}',
                './src/**/*.{js,jsx,ts,tsx}',
                './components/**/*.{js,jsx,ts,tsx}',
                './screens/**/*.{js,jsx,ts,tsx}',
        ],
        presets: [require('nativewind/preset')],
        theme: {
                extend: {
                        colors: {
                                // Light mode colors
                                background: {
                                        DEFAULT: '#EEEEEE',
                                        dark: '#181818',
                                },
                                surfacePrimary: {
                                        DEFAULT: '#FFFFFF',
                                        dark: '#252525',
                                        // dark: '#222630',
                                },
                                surfaceSecondary: {
                                        DEFAULT: '#EFEFEF',
                                        dark: '#1A1A1A',
                                },
                                textPrimary: {
                                        DEFAULT: '#000000',
                                        dark: '#FFFFFF',
                                },
                                textSecondary: {
                                        DEFAULT: '#666666',
                                        dark: '#A0A0A0',
                                },
                                textTertiary: {
                                        DEFAULT: '#999999',
                                        dark: '#666666',
                                },
                                border: {
                                        DEFAULT: '#000000',
                                        dark: '#333333',
                                },
                                // Theme colors (same in both modes)
                                primary: '#4CAF50',
                                secondary: '#1e3738',
                                accent: '#FFC107',
                                // Green palette
                                green: {
                                        50: '#E8F5E8',
                                        100: '#C8E6C9',
                                        200: '#A5D6A7',
                                        300: '#81C784',
                                        400: '#66BB6A',
                                        500: '#4CAF50', // Main green
                                        600: '#43A047',
                                        700: '#388E3C',
                                        800: '#2E7D32',
                                        900: '#1B5E20',
                                },
                                // Status colors
                                status: {
                                        success: '#4CAF50',
                                        error: '#F44336',
                                        warning: '#FF9800',
                                        info: '#2196F3',
                                },
                        },
                        backgroundImage: {
                                'gradient-green': 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                                'gradient-green-light': 'linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)',
                                'gradient-green-dark': 'linear-gradient(135deg, #388E3C 0%, #1B5E20 100%)',
                        },
                        fontFamily: {
                                primary: 'SpaceGrotesk-Regular',
                                space: {
                                        regular: 'SpaceGrotesk-Regular',
                                        medium: 'SpaceGrotesk-Medium',
                                        semibold: 'SpaceGrotesk-SemiBold',
                                        bold: 'SpaceGrotesk-Bold',
                                        light: 'SpaceGrotesk-Light',
                                },
                        },
                },
        },
        plugins: [],
};
