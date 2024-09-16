import clsx from "clsx"
import { formatIcp } from "../utils"
import { MenuButton } from "./dropdown/menu"
import { MenuButtonProps } from "@headlessui/react"

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
      className={clsx(
        "ik-component ik-border-transparent",
        "ik-bg-gray-200 ik-text-black hover:ik-bg-gray-100 active:ik-bg-gray-300 active:ik-border-gray-200",
        "hover:ik-shadow-md",
        "ik-font-bold ik-px-[10px] ik-min-w-[140px] ik-h-[40px] ik-flex ik-items-center ik-justify-center",
        "ik-px-[15px] ik-rounded-xl ik-border",
        className
      )}
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
