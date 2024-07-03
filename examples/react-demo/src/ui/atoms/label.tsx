import clsx from "clsx"
import React from "react"

export interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  menuItem?: boolean
}

export const Label: React.FC<Props> = ({ menuItem, children, className, ...props }) => {
  return (
    <label
      className={clsx(
        "text-xs text-black leading-4 dark:text-white",
        menuItem && "px-3 font-bold pt-2",
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}
