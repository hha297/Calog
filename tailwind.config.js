/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#19212e',
          darker: '#1e2738',
          green: '#4ade80',
          'green-light': '#86efac',
          'green-dark': '#16a34a',
        },
        gradient: {
          'green-start': '#86efac',
          'green-end': '#16a34a',
        },
      },
    },
  },
  plugins: [],
};
