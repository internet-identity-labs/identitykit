import { createContext } from "react"
import { IdentityKitTheme } from "../constants"

export const ThemeContext = createContext<IdentityKitTheme>(IdentityKitTheme.SYSTEM)
