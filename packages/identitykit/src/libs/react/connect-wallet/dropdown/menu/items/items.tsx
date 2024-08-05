import { MenuItems, MenuItemsProps } from "@headlessui/react"
import clsx from "clsx"

export function Items({
  className,
  innerClassName,
  children,
  ...props
}: MenuItemsProps & { innerClassName?: string }) {
  const menuItems = !Array.isArray(children) ? [children] : children
  return (
    <MenuItems
      transition
      className={clsx(
        "absolute right-0 z-10 mt-2 min-w-[320px] origin-top-right rounded-3xl bg-white dark:bg-zinc-900 shadow-lg transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in p-2.5",
        className
      )}
      {...props}
    >
      <div className={clsx("py-1", innerClassName)}>{menuItems}</div>
    </MenuItems>
  )
}
