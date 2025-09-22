/** @type {import('tailwindcss').Config} */
module.exports = {
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
                                primary: '#142b30', // Dark blue/black
                                secondary: '#1e3738', // Darker blue
                                tertiary: '#4CAF50', // Green
                                accent: '#FFC107', // Yellow/amber

                                // Text colors
                                text: {
                                        primary: '#212121',
                                        secondary: '#757575',
                                        light: '#FFFFFF',
                                        muted: '#9E9E9E',
                                },

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
                                'space-grotesk': ['SpaceGrotesk-Regular'],
                                'space-grotesk-bold': ['SpaceGrotesk-Bold'],
                                'space-grotesk-medium': ['SpaceGrotesk-Medium'],
                                'space-grotesk-light': ['SpaceGrotesk-Light'],
                                'space-grotesk-semibold': ['SpaceGrotesk-SemiBold'],
                        },
                },
        },
        plugins: [],
};
