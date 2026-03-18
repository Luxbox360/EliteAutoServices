/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#f5f5f5',
        },
        zinc: {
          50: '#f5f5f5',
        },
      }
    },
  },
  plugins: [],
}
