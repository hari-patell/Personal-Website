/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  future: {
    // Only apply hover styles on devices that support hover,
    // so taps on touch screens don't leave a stuck highlight
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Marble — cool, chalky whites rather than warm parchment
        cream: {
          50: '#FCFBF9',
          100: '#F7F6F2',
          200: '#EEECE6',
          300: '#E0DDD5',
          400: '#C9C5BB',
        },
        // Aegean blue — the single accent, used sparingly
        aegean: {
          DEFAULT: '#1D4E89',
          light: '#8DB0DB',
        },
        darkBg: '#171717',
      },
      ringOffsetColor: {
        DEFAULT: '#F7F6F2',
      },
    },
  },
  plugins: [],
};
