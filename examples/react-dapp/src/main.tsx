import React from "react"
import { ThemeProvider } from "next-themes"
import ReactDOM from "react-dom/client"

import App from "./app"

import "react-toastify/dist/ReactToastify.css"
import "@nfid/identitykit/react/styles.css"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" attribute="data-identity-kit-theme" enableSystem>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
