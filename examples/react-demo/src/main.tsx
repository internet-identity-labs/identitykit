import React from "react"
import ReactDOM from "react-dom/client"
import { ThemeProvider } from "next-themes"
import "./index.css"
import { AppWrappedInIdentityKit } from "./AppWrappedInIdentityKit.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="data-identity-kit-theme" enableSystem>
      <AppWrappedInIdentityKit />
    </ThemeProvider>
  </React.StrictMode>
)
