import clsx from "clsx"

export function Label({ className, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={clsx(
        "text-xs tracking-[0.16px] leading-4 mb-1 text-black dark:text-white",
        className
      )}
    />
  )
}
