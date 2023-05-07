/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '12.5%': { transform: 'rotate(45deg)' },
          '25%': { transform: 'rotate(90deg)' },
          '37.5%': { transform: 'rotate(135deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '62.5%': { transform: 'rotate(225deg)' },
          '75%': { transform: 'rotate(270deg)' },
          '87.5%': { transform: 'rotate(315deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        rotate: '1s infinite rotate step-end',
      },
    },
  },
  plugins: [],
  // corePlugins: {
  //   preflight: false,
  // }
}
