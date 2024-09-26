import clsx from "clsx"
import React from "react"
import { Spinner } from "../spinner"
export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  block?: boolean
  children?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  text?: boolean
  type?: "primary" | "secondary"
  large?: boolean
  as?: React.ElementType
}

export const getButtonClassName = ({
  className,
  type = "primary",
  block,
  large,
}: {
  className?: string
  type?: "primary" | "secondary"
  block?: boolean
  large?: boolean
}) =>
  clsx(
    type === "primary"
      ? "ik-component ik-border-transparent ik-bg-primary ik-text-white hover:ik-bg-teal-600 active:ik-bg-teal-700 active:ik-border-primary hover:ik-shadow-md ik-font-bold ik-px-[10px] ik-min-w-[140px] ik-h-[40px] ik-flex ik-items-center ik-justify-center ik-px-[15px] ik-rounded-xl border"
      : "ik-component ik-border-transparent",
    "ik-bg-gray-200 ik-text-black hover:ik-bg-gray-100 active:ik-bg-gray-300 active:ik-border-gray-200 hover:ik-shadow-md ik-font-bold ik-px-[10px] ik-min-w-[140px] ik-h-[40px] ik-flex ik-items-center ik-justify-center ik-px-[15px] ik-rounded-xl ik-border",
    {
      "disabled:ik-shadow-none disabled:ik-bg-gray-300 disabled:ik-border-gray-300 dark:disabled:ik-bg-zinc-700 dark:disabled:ik-border-zinc-700":
        type === "primary",
      "ik-w-full ik-block": block,
      "ik-h-[48px]": large,
    },
    className
  )

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  disabled,
  loading,
  icon,
  id,
  block,
  large,
  type = "primary",
  as: Component = "button",
  ...buttonProps
}: ButtonProps) => {
  return (
    <Component
      id={id}
      disabled={disabled || loading}
      className={getButtonClassName({ className, type, block, large })}
      {...buttonProps}
    >
      <div className="ik-flex ik-items-center ik-justify-center ik-space-x-2">
        {loading ? (
          <Spinner className="mr-1 text-white" />
        ) : icon ? (
          <div className="ik-flex ik-items-center ik-justify-center ik-w-6 ik-h-6">{icon}</div>
        ) : null}
        {children ? <div className="ik-text-center">{children}</div> : null}
      </div>
    </Component>
  )
}
