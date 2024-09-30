import { formatIcp } from "../utils"
import { MenuButton } from "./dropdown/menu"
import { MenuButtonProps } from "@headlessui/react"
import { getButtonClassName } from "../ui/button"

export type ConnectedButtonProps = MenuButtonProps & {
  connectedAccount: string
  icpBalance?: number
}

export function ConnectedButton({
  connectedAccount,
  icpBalance,
  className,
  children,
  ...props
}: ConnectedButtonProps) {
  return (
    <MenuButton
      id={"connect"}
      type="button"
      {...props}
      className={getButtonClassName({ className: className as string, type: "secondary" })}
    >
      {children ? (
        children
      ) : (
        <>
          <small className="ik-mr-2">
            {connectedAccount.substring(0, 5)}...
            {connectedAccount.substring(connectedAccount.length - 5)}
          </small>
          <div className="ik-bg-white ik-px-[5px] ik-rounded-md">
            <small className="ik-text-black ik-font-normal ik-text-xs">
              {icpBalance !== undefined && `${formatIcp(icpBalance)} ICP`}
            </small>
          </div>
        </>
      )}
    </MenuButton>
  )
}
