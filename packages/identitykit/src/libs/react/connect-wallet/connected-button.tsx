import clsx from "clsx"
import { MouseEventHandler, PropsWithChildren } from "react"
import { formatIcp } from "../utils"

export type ConnectedButtonProps = PropsWithChildren<{
  onClick?: MouseEventHandler<HTMLButtonElement>
  connectedAccount: string
  icpBalance?: number
  className?: string
}>

export function ConnectedButton({
  onClick,
  connectedAccount,
  icpBalance,
  className,
  children,
}: ConnectedButtonProps) {
  return (
    <button
      id={"connect"}
      type="button"
      onClick={onClick}
      className={clsx(
        "ik-border-transparent",
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
          <small className="mr-2">
            {connectedAccount.substring(0, 5)}...
            {connectedAccount.substring(connectedAccount.length - 5)}
          </small>
          <div className="bg-white px-[5px] rounded-md">
            <small className="text-black font-normal text-xs">
              {icpBalance !== undefined && `${formatIcp(icpBalance)} ICP`}
            </small>
          </div>
        </>
      )}
    </button>
  )
}
