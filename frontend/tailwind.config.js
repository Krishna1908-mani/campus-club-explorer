/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        palette: {
          burgundy: '#800020',
          deepBurgundy: '#5C001A',
          darkBurgundy: '#3B0010',
          charcoal: '#151515',
          white: '#FFFFFF',
          softBg: '#F8F7F8',
          lightRose: '#F4E7EC',
        },
        brand: {
          50: '#F8F7F8',
          100: '#F4E7EC', // Light Rose
          200: '#FCE7EF', // Soft Pink
          300: '#D9A0AE', // Muted Rose
          400: '#C2185B', // Accent Rose
          500: '#990033', // Rich Maroon
          600: '#800020', // Primary Burgundy
          700: '#6B001B',
          800: '#5C001A', // Deep Burgundy
          900: '#3B0010', // Dark Burgundy
          950: '#151515', // Charcoal
        },
        burgundy: {
          DEFAULT: '#800020',
          light: '#990033',
          dark: '#5C001A',
          deep: '#3B0010',
          rich: '#990033',
          rose: '#C2185B',
          soft: '#F4E7EC',
          muted: '#D9A0AE',
        },
        luxury: {
          black: '#151515',
          charcoal: '#1C1C1C',
          darkgrey: '#242424',
          grey: '#737373',
          lightgrey: '#E5E5E5',
          offwhite: '#F8F7F8',
          gold: '#C5A46D',
          'gold-light': '#E6D3B1',
          softpink: '#F4E7EC',
          mutedrose: '#D9A0AE',
        },
        dark: {
          bg: '#111111',       // Deep Charcoal/Dark
          card: '#181818',     // Card surface
          surface: '#222222',  // Secondary surface
          border: '#2E2E2E',   // Accessible border
          subtle: '#737373',   // Medium grey
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', '"DM Serif Display"', 'Georgia', 'serif'],
        display: ['"DM Serif Display"', '"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-burgundy': '0 0 25px -5px rgba(128, 0, 32, 0.35)',
        'soft': '0 4px 20px -2px rgba(17, 17, 17, 0.05)',
        'soft-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'luxury': '0 10px 30px -10px rgba(17, 17, 17, 0.08)',
        'luxury-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};


