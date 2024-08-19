import clsx from "clsx"
import React from "react"

export function ItemInner({ className, children, ...props }: React.HTMLProps<HTMLDivElement>) {
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
