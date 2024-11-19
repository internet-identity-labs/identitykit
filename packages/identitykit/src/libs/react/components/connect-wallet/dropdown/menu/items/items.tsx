import { MenuItems, MenuItemsProps } from "@headlessui/react"
import clsx from "clsx"
import { useTheme } from "../../../../../hooks"

export type ItemsProps = MenuItemsProps & { innerClassName?: string }

export function Items({ className, innerClassName, children, ...props }: ItemsProps) {
  const theme = useTheme()

  const menuItems = !Array.isArray(children) ? [children] : children

  return (
    <MenuItems
      anchor="bottom end"
      transition
      data-identity-kit-theme={theme}
      className={clsx(
        "ik-min-w-[320px] ik-rounded-3xl ik-bg-white dark:ik-bg-zinc-900 ik-shadow-lg ik-transition focus:ik-outline-none data-[closed]:ik-scale-95 data-[closed]:ik-transform data-[closed]:ik-opacity-0 data-[enter]:ik-duration-100 data-[leave]:ik-duration-75 data-[enter]:ik-ease-out data-[leave]:ik-ease-in ik-p-2.5 [--anchor-gap:8px] ik-z-[999]",
        className
      )}
      {...props}
    >
      <div className={clsx("ik-py-1", innerClassName)}>{menuItems}</div>
    </MenuItems>
  )
}
