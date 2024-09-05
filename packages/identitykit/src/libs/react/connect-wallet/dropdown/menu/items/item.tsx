import clsx from "clsx"
import React from "react"

export type ItemProps = React.HTMLProps<HTMLDivElement>

export function Item({ className, children, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "ik-flex ik-justify-between ik-w-full ik-p-2.5 ik-text-black dark:ik-text-white ik-cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
