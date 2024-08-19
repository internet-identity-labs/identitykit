import clsx from "clsx"
import React from "react"

type ButtonType = "primary" | "secondary"

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  block?: boolean
  children?: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
  text?: boolean
  type?: ButtonType
  as?: React.ElementType
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  type = "primary",
  disabled,
  icon,
  id,
  block,
  as: Component = "button",
  ...buttonProps
}: ButtonProps) => {
  const isPrimary = type === "primary"
  const isSecondary = type === "secondary"

  return (
    <Component
      id={id}
      disabled={disabled}
      className={clsx(
        "ik-transition ik-duration-75",
        "ik-text-center ik-text-sm first-letter:ik-capitalize hover:ik-no-underline",
        "ik-font-bold",
        "ik-rounded-md ik-outline-none ik-p-[15px] ik-leading-4",
        "ik-cursor-pointer disabled:ik-cursor-not-allowed",
        isPrimary &&
          clsx(
            "ik-text-white ik-bg-[#146F68] ik-border-transparent",
            "hover:ik-shadow-md hover:ik-shadow-[#0D9488]/40 hover:ik-bg-[#00A899]",
            "active:ik-border-teal-700 active:ik-bg-teal-700",
            "focus:ik-ring-0 focus:ik-ring-offset-0 focus:rik-ing-transparent",
            "disabled:ik-shadow-none disabled:ik-bg-gray-300 disabled:ik-border-gray-300",
            "dark:disabled:ik-bg-zinc-700 dark:disabled:ik-border-zinc-700"
          ),
        isSecondary &&
          clsx(
            "ik-text-[#146F68] dark:ik-text-teal-500 ik-border-transparent",
            "hover:ik-bg-gray-100 dark:hover:ik-bg-zinc-800",
            "active:ik-bg-gray-200 dark:active:ik-bg-zinc-900",
            "disabled:ik-text-gray-400",
            "dark:disabled:ik-text-zinc-600"
          ),
        block && clsx("ik-w-full ik-block"),
        className
      )}
      {...buttonProps}
    >
      <div className="ik-flex ik-items-center ik-justify-center ik-space-x-2">
        {icon ? (
          <div className="ik-flex ik-items-center ik-justify-center ik-w-6 ik-h-6">{icon}</div>
        ) : null}
        {children ? <div className="ik-text-center">{children}</div> : null}
      </div>
    </Component>
  )
}
