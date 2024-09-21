/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  content: ["./App.{js,jsx,ts,tsx}", "./Apps/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#480ca8",
        medium: "#fcd5ce",
      },
    },
  },
  plugins: [],
};
