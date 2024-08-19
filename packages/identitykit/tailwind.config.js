const colors = require("tailwindcss/colors")
const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'ik-',
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...colors,
        primary: "#146F68",
        signerDarkHoverBg: "#34343A",
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".gradient-border": {
          position: "relative",
          padding: "1px",
          "border-radius": "12px",
          background: "linear-gradient(135deg, #ed71ff, #899dff 51%, #63ffeb)",
          "background-clip": "border-box",
        },
      })
    }),
  ],
  darkMode: ["selector", "[data-identity-kit-theme*='dark']"],
}
