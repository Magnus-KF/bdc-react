/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mtg-primary': '#E6CA8D',
        'mtg-secondary': '#A33D25',
        'mtg-text': '#0D0F0F',
        'mtg-background': '#F9F7EC',
      },
      fontFamily: {
        'mtg': ['Roboto Slab', 'serif'],
      },
    },
  },
  plugins: [],
}