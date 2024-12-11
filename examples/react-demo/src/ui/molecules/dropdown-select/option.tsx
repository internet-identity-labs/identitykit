import { HTMLAttributes } from "react"

export const Option = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={
        "py-2.5 hover:bg-gray-100 cursor-pointer px-[13px] rounded-xl flex items-center text-sm text-black dark:hover:bg-zinc-500/20 dark:text-white"
      }
    >
      {children}
    </div>
  )
}
