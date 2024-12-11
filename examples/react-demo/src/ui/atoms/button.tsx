import clsx from "clsx"
import React, { ButtonHTMLAttributes } from "react"
import { Spinner } from "./spinner"

export type ButtonColor = "primary" | "stroke"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  block?: boolean
  color?: ButtonColor
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  disabled,
  id,
  block,
  color = "primary",
  type = "submit",
  loading,
  ...buttonProps
}: ButtonProps) => {
  const isPrimary = color === "primary"
  const isStroke = color === "stroke"

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || loading}
      className={clsx(
        "transition duration-75 text-center text-sm first-letter:capitalize hover:no-underline font-bold border rounded-xl leading-4 cursor-pointer disabled:cursor-not-allowed ring-none outline-none min-w-[120px] h-10 px-[15px]",
        isPrimary &&
          clsx(
            "text-white border-transparent",
            "bg-primary",
            "hover:shadow-md hover:bg-teal-600",
            "active:bg-teal-700 active:border-primary",
            "disabled:bg-zinc-300 disabled:shadow-none",
            "dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
          ),
        isStroke &&
          clsx(
            "text-black bg-transparent border-gray-900",
            "hover:text-white hover:bg-gray-900 hover:border-gray-900 hover:shadow-md",
            "active:text-white active:bg-gray-900",
            "disabled:shadow-none disabled:bg-white disabled:border-gray-300 disabled:text-gray-300",
            "dark:border-white dark:text-white dark:hover:text-black dark:hover:bg-white",
            "dark:active:text-black dark:active:bg-gray-300 dark:active:border-none"
          ),
        block && clsx("w-full block"),
        className
      )}
      {...buttonProps}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && <Spinner className="mr-2 text-white" />}
        {children}
      </div>
    </button>
  )
}
