export const colors = {
  // Primary colors
  primary: '#4CAF50',
  // Secondary colors
  secondary: '#232220',
  background: '#121212',

  // Accent colors
  accentPurple: '#DDC0FF',
  accentYellow: '#F5F378',
  accentTeal: '#450588',
  accentOrange: '#FF6F43',

  // Neutral colors
  white: '#FFFFFF',
  lightGray: '#C3C3C3',
  mediumGray: '#474747',
  darkGray: '#2F2F2F',
  darkerGray: '#232220',
  black: '#121212',

  // Status colors
  success: '#048155',
  error: '#C93838',
} as const;

export type ColorKey = keyof typeof colors;
