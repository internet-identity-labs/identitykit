import React from "react"
import ReactDOM from "react-dom/client"
import { ThemeProvider } from "next-themes"
import "@nfid/identitykit/react/styles.css"
import "./index.css"
import { AppWrappedInIdentityKit } from "./AppWrappedInIdentityKit.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" attribute="data-identity-kit-theme" enableSystem>
      <AppWrappedInIdentityKit />
    </ThemeProvider>
  </React.StrictMode>
)
