/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff9324",
      },
      fontFamily: {
        display: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      screens: {
        '3xl': '1920px',
      },
      animation: {
        marquee: 'marquee 8s linear infinite',
        'text-shine': 'text-shine 3s ease-in-out infinite alternate',
        blob1: 'blob1 8s ease-in-out infinite',
        blob2: 'blob2 10s ease-in-out infinite',
        blob3: 'blob3 12s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
        'text-shine': {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' },
        },
        blob1: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -60px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        blob2: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(-40px, 60px) scale(1.05)' },
          '66%': { transform: 'translate(20px, -40px) scale(0.95)' },
        },
        blob3: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(20px, 140px) scale(1.15)' },
          '66%': { transform: 'translate(-30px, -30px) scale(0.85)' },
        },
      }
    },
  },
  plugins: [],
}
