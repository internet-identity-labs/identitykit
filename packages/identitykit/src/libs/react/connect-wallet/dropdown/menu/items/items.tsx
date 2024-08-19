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
        "ik-absolute ik-right-0 ik-z-10 ik-mt-2 ik-min-w-[320px] ik-origin-top-right ik-rounded-3xl ik-bg-white dark:ik-bg-zinc-900 ik-shadow-lg ik-transition focus:ik-outline-none data-[closed]:ik-scale-95 data-[closed]:ik-transform data-[closed]:ik-opacity-0 data-[enter]:ik-duration-100 data-[leave]:ik-duration-75 data-[enter]:ik-ease-out data-[leave]:ik-ease-in ik-p-2.5",
        className
      )}
      {...props}
    >
      <div className={clsx("ik-py-1", innerClassName)}>{menuItems}</div>
    </MenuItems>
  )
}
