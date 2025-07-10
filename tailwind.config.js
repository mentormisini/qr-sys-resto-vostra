/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // adjust paths according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A1F44',
          800: '#143661',
          700: '#1D4E8F',
        },
        gold: {
          400: '#F5C758',
          500: '#D4AF37',
          600: '#A98307',
        },
        cream: {
          50: '#FFF9F0',
          100: '#FFF3E0',
        },
        charcoal: {
          700: '#2E2E2E',
          900: '#1B1B1B',
        },
      }
    }
  },
  plugins: [],
}
