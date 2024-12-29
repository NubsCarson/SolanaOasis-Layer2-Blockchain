/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mystic-purple': '#7f3ace',
        'void-black': '#0a0a0a',
        'digital-blue': '#263759',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px #7f3ace' },
          '100%': { textShadow: '0 0 20px #7f3ace, 0 0 30px #7f3ace' },
        },
      },
    },
  },
  plugins: [],
} 