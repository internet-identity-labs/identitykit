import { PropsWithChildren } from "react"
import clsx from "clsx"

export function Container({
  children,
  className,
  ...props
}: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      {...props}
      className={clsx("container w-full max-w-[1341px] px-[20px] lg:px-[30px] mx-auto", className)}
    >
      {children}
    </div>
  )
}
