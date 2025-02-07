import defaultTheme from "tailwindcss/defaultTheme"
import colors from "tailwindcss/colors"

const configExtension = {
  colors: {
    primary: "#146F68",
    dark: "#141518",
    zinc: colors.zinc,
  },
  fontFamily: {
    ...defaultTheme.fontFamily,
    sans: ["Inter", ...defaultTheme.fontFamily.sans],
    poppins: ["Poppins", ...defaultTheme.fontFamily.serif],
  },
}

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: configExtension,
  },
  darkMode: "class",
  // darkMode: ["selector", "[data-theme*='dark']"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [],
}
