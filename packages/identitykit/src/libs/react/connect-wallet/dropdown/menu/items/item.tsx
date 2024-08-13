import { MenuItem, MenuItemProps } from "@headlessui/react"

export type ItemProps = MenuItemProps

export function Item({ children, ...props }: MenuItemProps) {
  return <MenuItem {...props}>{children}</MenuItem>
}
