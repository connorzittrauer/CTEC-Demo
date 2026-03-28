/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#E6E6E6",
        surface: "#D3D3D3",
        border: "#C0C0C0",
        secondary: "#A8A8A0",
        text: "#7B7B7A",
        accent: "#7A5CFF",
        "accent-hover": "#9278FF",
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["IBM Plex Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}