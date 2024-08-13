import { Button, ButtonProps } from "../button"
import { useState, ComponentType, ReactNode } from "react"
import { Menu, MenuAddressItem, MenuItems, MenuLogoutItem, MenuProps } from "./menu"
import { MenuButton, MenuButtonProps } from "@headlessui/react"

export type DropdownProps = {
  className?: string
  icpBalance?: number
  connectedAccount: string
  buttonComponent?: ComponentType<ButtonProps>
  onDisconnect: () => unknown
}

export function Dropdown({
  icpBalance,
  connectedAccount,
  buttonComponent,
  onDisconnect,
  ...props
}: DropdownProps & MenuProps) {
  const [connectedAddressCopied, setConnectedAddressCopied] = useState(false)
  const ButtonComponent = buttonComponent ?? Button

  return (
    <Menu {...props}>
      <MenuButton
        as={({ className, children, ...props }: MenuButtonProps) => (
          <ButtonComponent
            connectedAccount={connectedAccount}
            icpBalance={icpBalance}
            className={className as string}
            {...props}
          >
            {children as ReactNode}
          </ButtonComponent>
        )}
      />

      <MenuItems>
        <MenuAddressItem
          value={connectedAccount}
          onCopied={() => setConnectedAddressCopied(true)}
          onCopiedTimeout={() => setConnectedAddressCopied(false)}
          copied={connectedAddressCopied}
        />
        <MenuLogoutItem onClick={onDisconnect} />
      </MenuItems>
    </Menu>
  )
}
