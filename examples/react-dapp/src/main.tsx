import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { ThemeProvider } from "next-themes"
import "@nfid/identitykit/react/styles.css"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" attribute="data-identity-kit-theme" enableSystem>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
