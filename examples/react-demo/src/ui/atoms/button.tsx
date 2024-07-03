import clsx from "clsx"
import React from "react"
import { Spinner } from "./spinner"

export type ButtonType = "primary" | "secondary" | "stroke" | "ghost" | "red"

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  block?: boolean
  children?: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
  text?: boolean
  type?: ButtonType
  isSmall?: boolean
  isSubmit?: boolean
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  type = "primary",
  disabled,
  icon,
  id,
  isSmall,
  block,
  isSubmit = true,
  loading,
  ...buttonProps
}: ButtonProps) => {
  const isPrimary = type === "primary"
  const isSecondary = type === "secondary"
  const isGhost = type === "ghost"
  const isStroke = type === "stroke"
  const isRed = type === "red"

  return (
    <button
      id={id}
      disabled={disabled || loading}
      type={isSubmit ? "submit" : "button"}
      className={clsx(
        "transition duration-75",
        "text-center text-sm first-letter:capitalize hover:no-underline",
        "font-bold",
        "border rounded-xl p-[15px] leading-4",
        "cursor-pointer disabled:cursor-not-allowed",
        "ring-none outline-none",
        "!py-0",
        !icon && "min-w-[120px]",
        isSmall ? "h-10" : "h-12",
        isSmall ? (children ? "px-[15px]" : "px-[11px]") : "px-[15px]",
        isPrimary &&
          clsx(
            "text-white border-transparent",
            "bg-primary",
            "hover:shadow-md hover:bg-teal-600",
            "active:bg-teal-700 active:border-primary",
            "disabled:bg-zinc-300 disabled:shadow-none",
            "dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
          ),
        isSecondary &&
          clsx(
            "text-white bg-gray-900",
            "hover:border-gray-900 hover:bg-gray-900 hover:shadow-md hover:shadow-gray-900/40",
            "focus:border-gray-900 focus:bg-gray-900",
            "disabled:border-gray-900/50 disabled:bg-gray-900/50",
            "active:border-gray-900 active:bg-gray-900",
            "disabled:shadow-none"
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
        isGhost &&
          clsx(
            "text-teal-600 dark:text-teal-500 border-none",
            "hover:bg-zinc-100",
            "active:bg-zinc-200",
            "disabled:bg-white disabled:text-gray-400",
            "dark:hover:bg-zinc-800 dark:active:bg-zinc-800"
          ),
        isRed &&
          clsx(
            "text-white bg-red-600 border-red-600",
            "hover:shadow-md hover:shadow-red-600/40 hover:border-red-500 hover:bg-red-500",
            "active:border-red-700 active:bg-red-700",
            "focus:border-red-600 focus:bg-red-600",
            "disabled:shadow-none disabled:bg-gray-300 disabled:border-gray-300"
          ),
        block && clsx("w-full block"),
        className
      )}
      {...buttonProps}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading ? (
          <Spinner className="mr-2 text-white" />
        ) : (
          icon && <div className="flex items-center justify-center w-6 h-6">{icon}</div>
        )}
        {children}
      </div>
    </button>
  )
}
