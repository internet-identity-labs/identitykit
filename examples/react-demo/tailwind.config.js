import defaultTheme from "tailwindcss/defaultTheme"
import colors from "tailwindcss/colors"
import merge from "lodash.merge"
import identityKitConfig from "../../packages/identitykit/tailwind.config"

const configExtension = {
  colors: {
    primary: "#146F68",
    dark: "#141518",
    zinc: colors.zinc
  },
  fontFamily: {
    ...defaultTheme.fontFamily,
    sans: ["Inter", ...defaultTheme.fontFamily.sans],
    mono: ["IBM Plex Mono", ...defaultTheme.fontFamily.mono],
  }
}

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: configExtension,
  },
  darkMode: ["selector", "[data-identity-kit-theme*='dark']"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // TODO: check that this is only required for development
    // The package exports the compiled style sheet
    // "../../packages/identitykit/src/libs/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
}
