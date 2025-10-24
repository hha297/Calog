/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // #FF5A18
        primary: '#4CAF50',
        secondary: '#232220',
        background: '#121212',
        accentPurple: '#DDC0FF',
        accentYellow: '#F5F378',
        accentTeal: '#450588',
        accentOrange: '#FF6F43',

        lightGray: '#C3C3C3',
        mediumGray: '#474747',
        darkGray: '#2F2F2F',
        darkerGray: '#232220',

        // Status Colors
        success: '#048155',
        error: '#C93838',
      },
      fontFamily: {
        'space-grotesk': ['SpaceGrotesk-Regular'],
        'space-grotesk-light': ['SpaceGrotesk-Light'],
        'space-grotesk-medium': ['SpaceGrotesk-Medium'],
        'space-grotesk-semibold': ['SpaceGrotesk-SemiBold'],
        'space-grotesk-bold': ['SpaceGrotesk-Bold'],
      },
    },
  },
  plugins: [],
};
