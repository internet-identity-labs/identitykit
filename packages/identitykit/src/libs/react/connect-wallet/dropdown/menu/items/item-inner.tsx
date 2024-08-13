import clsx from "clsx"
import React from "react"

export function ItemInner({ className, children, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "flex justify-between w-full p-2.5 text-black dark:text-white cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
