import { useEffect, useState } from "react"
import { IdentityKitTheme } from "../constants"

export function useProceedTheme(theme: IdentityKitTheme = IdentityKitTheme.SYSTEM) {
  const [finalTheme, setFinalTheme] = useState(theme)

  useEffect(() => {
    if (!theme || theme === IdentityKitTheme.SYSTEM) {
      setFinalTheme(
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
          ? IdentityKitTheme.DARK
          : IdentityKitTheme.LIGHT
      )
    } else {
      setFinalTheme(theme)
    }
  }, [theme])

  return finalTheme
}
