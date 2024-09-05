import { useContext, useEffect, ComponentType, ReactNode } from "react"
import { IdentityKitContext } from "../context"
import { ConnectButton, ConnectButtonProps } from "./connect-button"
import { ConnectedButton, ConnectedButtonProps } from "./connected-button"
import { DropdownMenu, DropdownMenuProps } from "./dropdown"
import { MenuButton, MenuButtonProps } from "@headlessui/react"
import { MenuAddressItem, MenuItems, MenuDisconnectItem } from "./dropdown/menu"

export function ConnectWallet({
  connectButtonComponent,
  connectedButtonComponent,
  dropdownMenuComponent,
  triggerManualDisconnect,
}: {
  connectButtonComponent?: ComponentType<ConnectButtonProps>
  connectedButtonComponent?: ComponentType<ConnectedButtonProps>
  dropdownMenuComponent?: ComponentType<
    DropdownMenuProps & {
      disconnect: () => unknown
      icpBalance?: number
      connectedAccount: string
    }
  >
  triggerManualDisconnect?: boolean
}) {
  const { toggleModal, connectedAccount, icpBalance, logout, selectedSigner } =
    useContext(IdentityKitContext)

  useEffect(() => {
    if (triggerManualDisconnect) {
      logout()
    }
  }, [triggerManualDisconnect])

  const ConnectButtonComponent = connectButtonComponent ?? ConnectButton
  const ConnectedButtonComponent = connectedButtonComponent ?? ConnectedButton
  const DropdownMenuComponent = dropdownMenuComponent ?? DropdownMenu

  if (!connectedAccount)
    return (
      <ConnectButtonComponent
        onClick={() => {
          toggleModal()
        }}
        disabled={selectedSigner && !connectedAccount}
      />
    )

  return (
    <>
      <DropdownMenuComponent
        disconnect={logout}
        icpBalance={icpBalance}
        connectedAccount={connectedAccount}
      >
        <MenuButton
          as={({ className, children, ...props }: MenuButtonProps) => (
            <ConnectedButtonComponent
              connectedAccount={connectedAccount}
              icpBalance={icpBalance}
              className={className as string}
              {...props}
            >
              {children as ReactNode}
            </ConnectedButtonComponent>
          )}
        />
        <MenuItems>
          <MenuAddressItem value={connectedAccount} />
          <MenuDisconnectItem onClick={logout} />
        </MenuItems>
      </DropdownMenuComponent>
    </>
  )
}
