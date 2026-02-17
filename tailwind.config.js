/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFCFA',
          100: '#FAF7F2',
          200: '#F5F0E8',
          300: '#EBE4D8',
          400: '#D6CFC3',
        },
        darkBg: '#171717',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      ringOffsetColor: {
        DEFAULT: '#FAF7F2',
      },
    },
  },
  plugins: [],
};
