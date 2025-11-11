/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        arctic: {
          blue: "#96D7FE",
          black: "#000000"
        }
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
};
