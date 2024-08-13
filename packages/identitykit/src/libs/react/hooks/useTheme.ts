import { IdentityKitTheme } from "../constants"

export function useTheme(theme: IdentityKitTheme = IdentityKitTheme.SYSTEM) {
  // theme inherits from system by default
  return theme === IdentityKitTheme.SYSTEM
    ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? IdentityKitTheme.DARK
      : IdentityKitTheme.LIGHT
    : theme
}
