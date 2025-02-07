import clsx from "clsx"
import React from "react"

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  block?: boolean
  children?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  icon?: string
  text?: boolean
  type?: "primary" | "secondary" | "outline"
  large?: boolean
  as?: React.ElementType
}

const buttonStyle = {
  primary:
    "component border-transparent bg-primary text-white hover:bg-teal-600 active:bg-teal-700 active:border-primary",
  secondary:
    "component border-white bg-[#FFEBFD1A] hover:bg-[#FFEBFD40] active:bg-[#FFEBFD1A] active:opacity-50 text-white",
  outline:
    "component border-black text-black bg-transparent hover:bg-gray-700 hover:border-gray-700 hover:text-white active:text-white active:bg-black active:border-black dark:border-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black dark:active:border-gray-300 dark:active:bg-gray-300 dark:active:text-black dark:text-white",
}

const getButtonClassName = ({
  className,
  type = "primary",
  block,
}: {
  className?: string
  type?: "primary" | "secondary" | "outline"
  block?: boolean
  large?: boolean
}) =>
  clsx(
    "transition-colors duration-200 hover:shadow-md font-bold px-[10px] min-w-[140px] h-[48px] flex items-center justify-center px-[15px] rounded-xl border",
    buttonStyle[type],
    {
      "disabled:shadow-none disabled:bg-gray-300 disabled:border-gray-300 dark:disabled:bg-zinc-700 dark:disabled:border-zinc-700":
        type === "primary",
      "w-full block": block,
    },
    className
  )

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  disabled,
  loading,
  id,
  block,
  large,
  type = "primary",
  as: Component = "button",
  icon,
  ...buttonProps
}: ButtonProps) => {
  return (
    <Component
      id={id}
      disabled={disabled || loading}
      className={getButtonClassName({ className, type, block, large })}
      {...buttonProps}
    >
      <div className="flex items-center justify-center space-x-2">
        {icon && <img className=" mr-[10px]" src={icon} alt="btn icon" />}
        {children}
      </div>
    </Component>
  )
}
