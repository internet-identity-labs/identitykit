import React from "react"
import { ThemeProvider } from "next-themes"
import ReactDOM from "react-dom/client"

import App from "./app"

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
