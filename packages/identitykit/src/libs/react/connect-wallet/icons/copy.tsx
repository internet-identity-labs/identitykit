import React, { useContext } from "react"
import { IdentityKitContext } from "../../context"
import { IdentityKitTheme } from "../../constants"
import colors from "tailwindcss/colors"

export function Copy(props: React.SVGProps<SVGSVGElement>) {
  const { theme } = useContext(IdentityKitContext)
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.7795 5.55534V5.55534C11.7795 4.727 11.7795 4.31283 11.6442 3.98612C11.4638 3.55052 11.1177 3.20443 10.6821 3.024C10.3554 2.88867 9.94119 2.88867 9.11285 2.88867H6.44618C4.77008 2.88867 3.93202 2.88867 3.41132 3.40937C2.89062 3.93007 2.89062 4.76812 2.89062 6.44423V9.1109C2.89062 9.93924 2.89062 10.3534 3.02595 10.6801C3.20638 11.1157 3.55247 11.4618 3.98808 11.6422C4.31478 11.7776 4.72895 11.7776 5.55729 11.7776V11.7776"
        stroke={theme === IdentityKitTheme.DARK ? colors.white : colors.black}
        stroke-width="1.8"
      />
      <rect
        x="8.22266"
        y="8.22266"
        width="8.88889"
        height="8.88889"
        rx="1.77778"
        stroke={theme === IdentityKitTheme.DARK ? colors.white : colors.black}
        stroke-width="1.8"
      />
    </svg>
  )
}
