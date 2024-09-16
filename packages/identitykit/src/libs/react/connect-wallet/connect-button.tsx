import clsx from "clsx"
import { HTMLProps } from "react"

export type ConnectButtonProps = HTMLProps<HTMLButtonElement>

export function ConnectButton({ onClick, className, disabled, children }: ConnectButtonProps) {
  return (
    <button
      id={"connect"}
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "ik-component ik-border-transparent",
        "ik-bg-primary ik-text-white hover:ik-bg-teal-600 active:ik-bg-teal-700 active:ik-border-primary",
        "hover:ik-shadow-md",
        "ik-font-bold ik-px-[10px] ik-min-w-[140px] ik-h-[40px] ik-flex ik-items-center ik-justify-center",
        "ik-px-[15px] ik-rounded-xl border",
        className
      )}
    >
      {children ? children : <small>Connect wallet</small>}
    </button>
  )
}
