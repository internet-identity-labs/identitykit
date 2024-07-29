import { Menu, MenuButton, MenuButtonProps, MenuItem, MenuItems } from "@headlessui/react"
import { CopiedIcon, CopyIcon, LogoutIcon } from "./icons"
import { CopyToClipboard } from "../ui"
import { Button, ButtonProps } from "./button"
import clsx from "clsx"
import { useState, ComponentType } from "react"

export type DropdownProps = {
  className?: string
  icpBalance?: number
  connectedAccount: string
  buttonComponent?: ComponentType<ButtonProps>
  onDisconnect: () => unknown
}

export function Dropdown({
  className,
  icpBalance,
  connectedAccount,
  buttonComponent,
  onDisconnect,
}: DropdownProps) {
  const [connectedAddressCopied, setConnectedAddressCopied] = useState(false)
  const ButtonComponent = buttonComponent ?? Button

  return (
    <Menu as="div" className={clsx("relative inline-block text-left", className)}>
      <div>
        <MenuButton
          as={({ className, ...props }: MenuButtonProps) => (
            <ButtonComponent
              connectedAccount={connectedAccount}
              icpBalance={icpBalance}
              className={className as string}
              {...props}
            />
          )}
        />
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 min-w-[320px] origin-top-right rounded-3xl bg-white dark:bg-zinc-900 shadow-lg transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in p-2.5"
      >
        <div className="py-1">
          <MenuItem>
            <CopyToClipboard
              value={connectedAccount}
              onCopied={() => setConnectedAddressCopied(true)}
              onCopiedTimeout={() => setConnectedAddressCopied(false)}
              component={({ onClick }: { onClick: () => unknown }) => (
                <div className="flex justify-between w-full p-2.5 cursor-pointer" onClick={onClick}>
                  <small className="font-semibold text-black dark:text-white">Wallet address</small>
                  <div className="flex">
                    <small className="font-semibold">{`${connectedAccount.substring(0, 5)}...${connectedAccount.substring(connectedAccount.length - 5)}`}</small>
                    {connectedAddressCopied ? (
                      <CopiedIcon className="ml-2" />
                    ) : (
                      <CopyIcon className="ml-2" />
                    )}
                  </div>
                </div>
              )}
            />
          </MenuItem>
          <MenuItem>
            <div
              className="flex justify-between w-full p-2.5 text-black dark:text-white cursor-pointer"
              onClick={() => {
                onDisconnect()
              }}
            >
              <small className="font-semibold text-black dark:text-white">Disconnect</small>
              <LogoutIcon />
            </div>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
}
