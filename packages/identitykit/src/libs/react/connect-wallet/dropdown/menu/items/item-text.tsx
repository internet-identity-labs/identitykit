import clsx from "clsx"

export function ItemText(props: React.HTMLProps<HTMLSpanElement>) {
  return (
    <small
      {...props}
      className={clsx("ik-font-semibold ik-text-black dark:ik-text-white", props.className)}
    />
  )
}
