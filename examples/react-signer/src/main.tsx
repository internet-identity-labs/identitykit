import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "@radix-ui/themes/styles.css"
// import { ThemeProvider } from "next-themes"

import "./style.css"

// const theme = new URLSearchParams(window.location.search).get("theme") ?? "light"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ThemeProvider forcedTheme={theme} attribute="class"> */}
    <App />
    {/* </ThemeProvider> */}
  </React.StrictMode>
)
