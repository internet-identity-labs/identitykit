import { MenuButton, MenuButtonProps } from "@headlessui/react"
import clsx from "clsx"

export type ButtonProps = MenuButtonProps

export function Button({ className, ...props }: MenuButtonProps) {
  return <MenuButton {...props} className={clsx("ik-component", className)} />
}
