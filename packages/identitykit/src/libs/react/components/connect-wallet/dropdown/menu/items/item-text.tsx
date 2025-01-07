import clsx from "clsx"

export type ItemTextProps = React.HTMLProps<HTMLSpanElement>

export function ItemText(props: ItemTextProps) {
  return (
    <small
      {...props}
      className={clsx(
        "ik-component ik-font-semibold ik-text-black dark:ik-text-white",
        props.className
      )}
    />
  )
}
