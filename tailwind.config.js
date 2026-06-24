/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1a1a1a',
        'dark-light': '#2d2d2d',
        'dark-lighter': '#404040',
      },
    },
  },
  plugins: [],
};
