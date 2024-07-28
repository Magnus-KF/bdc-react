/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mtg-primary': '#D3D3D3',  // Light gray
        // 'mtg-secondary': '#8B0000',  // Dark red
        'mtg-secondary': '#B22222',  // A lighter red, could be more readable
        // or
        // 'mtg-secondary': '#4B0082',  // Indigo, for a different look
        'mtg-text': '#E6E6E6',  // Very light gray
        'mtg-background': '#1A1A1A',  // Very dark gray
        'mtg-accent': '#FFD700',  // Gold
      },
      fontFamily: {
        'mtg-header': ['Cinzel', 'serif'],
        'mtg-body': ['Noto Serif', 'serif'],
      },
    },
  },
  plugins: [],
}