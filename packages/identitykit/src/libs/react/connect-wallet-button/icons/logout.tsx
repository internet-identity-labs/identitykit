import React, { useContext } from "react"
import { IdentityKitContext } from "../../context"
import { IdentityKitTheme } from "../../constants"
import colors from "tailwindcss/colors"

export function Logout(props: React.SVGProps<SVGSVGElement>) {
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
        d="M9.99996 2.5L9.16663 2.5C6.8096 2.5 5.63109 2.5 4.89886 3.23223C4.16663 3.96447 4.16663 5.14298 4.16663 7.5L4.16663 12.5C4.16663 14.857 4.16663 16.0355 4.89886 16.7678C5.63109 17.5 6.8096 17.5 9.16663 17.5L9.99996 17.5"
        stroke={theme === IdentityKitTheme.DARK ? colors.white : colors.black}
        stroke-width="1.8"
        stroke-linecap="round"
      />
      <path
        d="M13.0209 6.25L16.7709 10M16.7709 10L13.0209 13.75M16.7709 10L9.27087 10"
        stroke={theme === IdentityKitTheme.DARK ? colors.white : colors.black}
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </svg>
  )
}
