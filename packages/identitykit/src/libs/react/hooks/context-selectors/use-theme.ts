import { ThemeContext } from "../../contexts"
import { useContext } from "react"

export function useTheme() {
  return useContext(ThemeContext)
}
