import { PropsWithChildren } from "react"
import { ThemeContext } from "../../contexts"
import { useProceedTheme } from "../../hooks"
import { IdentityKitTheme } from "../../constants"

export function ThemeProvider({
  children,
  ...props
}: PropsWithChildren<{ theme?: IdentityKitTheme }>) {
  const theme = useProceedTheme(props.theme)
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
