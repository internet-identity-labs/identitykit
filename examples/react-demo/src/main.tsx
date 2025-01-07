import React from "react"
import ReactDOM from "react-dom/client"
import { ThemeProvider } from "next-themes"
import { AppWrappedInIdentityKit } from "./app-in-identitykit-provider.tsx"

import "@nfid/identitykit/react/styles.css"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" attribute="data-identity-kit-theme" enableSystem>
      <AppWrappedInIdentityKit />
    </ThemeProvider>
  </React.StrictMode>
)
