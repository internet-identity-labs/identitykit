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
        "border-transparent",
        "bg-gray-200 text-black hover:bg-gray-100 active:bg-gray-300 active:border-gray-200",
        "hover:shadow-md",
        "font-bold px-[10px] min-w-[140px] h-[40px] flex items-center justify-center",
        "px-[15px] rounded-xl border",
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
