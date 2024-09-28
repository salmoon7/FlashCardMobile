/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./Apps/**/*.{js,jsx,ts,tsx}"], // Combine your content paths
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
