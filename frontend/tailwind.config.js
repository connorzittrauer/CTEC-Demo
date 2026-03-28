/* This is the Tailwind CSS configuration file for the project. 
   It defines the content paths, theme customizations, and plugins for Tailwind CSS. 
   
   The theme is extended to include custom colors and font families that are used throughout the application.
   For this app, we are using an industrial color palette to reflect the product

*/

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#D3D3D3",
        surface: "#e9e9e9",
        border: "#C0C0C0",
        secondary: "#d9dbdd",
        text: "#313131",
        accent: "#3b3b3f",
        "accent-hover": "#5A5A60",
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["IBM Plex Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}