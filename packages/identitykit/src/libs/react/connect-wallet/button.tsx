import clsx from "clsx"
import { MouseEventHandler } from "react"
import { formatIcp } from "../utils"

export type ButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>
  connectedAccount?: string
  icpBalance?: number
  className?: string
}

export function Button({ onClick, connectedAccount, icpBalance, className }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "border-transparent",
        connectedAccount
          ? "bg-gray-200 text-black hover:bg-gray-100 active:bg-gray-300 active:border-gray-200"
          : "bg-primary text-white hover:bg-teal-600 active:bg-teal-700 active:border-primary",
        "hover:shadow-md",
        "font-bold px-[10px] min-w-[140px] h-[40px] flex items-center justify-center",
        "px-[15px] rounded-xl border",
        className
      )}
    >
      {!connectedAccount ? (
        <small>Connect wallet</small>
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
