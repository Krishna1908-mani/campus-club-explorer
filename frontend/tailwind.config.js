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
        brand: {
          50: '#FAF9F7',
          100: '#FCE7EF', // Soft Pink
          200: '#F6C1D0',
          300: '#D9A0AE', // Muted Rose
          400: '#C2185B', // Accent Rose
          500: '#990033', // Rich Maroon
          600: '#800020', // Primary Burgundy
          700: '#6B001B',
          800: '#5C001A', // Deep Burgundy
          900: '#3B0010', // Dark Wine
          950: '#26000B',
        },
        burgundy: {
          DEFAULT: '#800020',
          light: '#990033',
          dark: '#5C001A',
          deep: '#3B0010',
          rich: '#990033',
          rose: '#C2185B',
          soft: '#FCE7EF',
          muted: '#D9A0AE',
        },
        luxury: {
          black: '#111111',
          charcoal: '#1C1C1C',
          darkgrey: '#292929',
          grey: '#737373',
          lightgrey: '#E5E5E5',
          offwhite: '#FAF9F7',
          gold: '#C5A46D',
          'gold-light': '#E6D3B1',
          softpink: '#FCE7EF',
          mutedrose: '#D9A0AE',
        },
        dark: {
          bg: '#111111',       // Pure Black / deep dark
          card: '#1C1C1C',     // Charcoal surface
          surface: '#292929',  // Dark grey secondary surface
          border: '#383838',   // Accessible border
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


