import clsx from "clsx"
import { MouseEventHandler, PropsWithChildren } from "react"

export type ConnectButtonProps = PropsWithChildren<{
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
}>

export function ConnectButton({ onClick, className, children }: ConnectButtonProps) {
  return (
    <button
      id={"connect"}
      type="button"
      onClick={onClick}
      className={clsx(
        "border-transparent",
        "bg-primary text-white hover:bg-teal-600 active:bg-teal-700 active:border-primary",
        "hover:shadow-md",
        "font-bold px-[10px] min-w-[140px] h-[40px] flex items-center justify-center",
        "px-[15px] rounded-xl border",
        className
      )}
    >
      {children ? children : <small>Connect wallet</small>}
    </button>
  )
}
