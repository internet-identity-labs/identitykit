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
  isSmall?: boolean
  as?: React.ElementType
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
  as: Component = "button",
  ...buttonProps
}: ButtonProps) => {
  const isPrimary = type === "primary"
  const isSecondary = type === "secondary"

  return (
    <Component
      id={id}
      onClick={async () => 1}
      disabled={disabled}
      className={clsx(
        "transition duration-75",
        "text-center text-sm first-letter:capitalize hover:no-underline",
        "font-bold",
        "rounded-md outline-none p-[15px] leading-4",
        "cursor-pointer disabled:cursor-not-allowed",
        isPrimary &&
          clsx(
            "text-white bg-[#146F68] border-transparent",
            "hover:shadow-md hover:shadow-[#0D9488]/40 hover:bg-[#00A899]",
            "active:border-teal-700 active:bg-teal-700",
            "focus:ring-0 focus:ring-offset-0 focus:ring-transparent",
            "disabled:shadow-none disabled:bg-gray-300 disabled:border-gray-300"
          ),
        isSecondary &&
          clsx(
            "text-[#146F68] border-transparent",
            "hover:bg-gray-100",
            "active:bg-gray-200",
            "disabled:bg-white disabled:border-transparent disabled:text-secondary"
          ),
        block && clsx("w-full block"),
        className
      )}
      {...buttonProps}
    >
      <div className="flex items-center justify-center space-x-2">
        {icon ? <div className="flex items-center justify-center w-6 h-6">{icon}</div> : null}
        {children ? <div className="text-center">{children}</div> : null}
      </div>
    </Component>
  )
}
