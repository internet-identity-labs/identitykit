import { useContext, ComponentType } from "react"
import { IdentityKitContext } from "../context"
import { ConnectButton, ConnectButtonProps } from "./connect-button"
import { ConnectedButton, ConnectedButtonProps } from "./connected-button"
import { DropdownMenu, DropdownMenuProps } from "./dropdown"
import { MenuAddressItem, MenuItems, MenuDisconnectItem } from "./dropdown/menu"

export function ConnectWallet({
  connectButtonComponent,
  connectedButtonComponent,
  dropdownMenuComponent,
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
}) {
  const ctx = useContext(IdentityKitContext)

  if (!ctx) {
    throw new Error("Identitykit Context is null")
  }

  const { toggleModal, user, icpBalance, disconnect, isInitializing, isUserConnecting } = ctx

  const ConnectButtonComponent = connectButtonComponent ?? ConnectButton
  const ConnectedButtonComponent = connectedButtonComponent ?? ConnectedButton
  const DropdownMenuComponent = dropdownMenuComponent ?? DropdownMenu

  if (!user)
    return (
      <ConnectButtonComponent
        onClick={() => {
          toggleModal()
        }}
        disabled={isInitializing}
        loading={isUserConnecting}
      />
    )

  const connectedAccount = user.principal.toString()

  const props = { disconnect, icpBalance, connectedAccount }

  return (
    <>
      <DropdownMenuComponent
        {...(dropdownMenuComponent
          ? props
          : ({} as DropdownMenuProps & {
              disconnect: () => unknown
              icpBalance?: number
              connectedAccount: string
            }))}
      >
        <ConnectedButtonComponent connectedAccount={connectedAccount} icpBalance={icpBalance} />
        <MenuItems>
          <MenuAddressItem value={connectedAccount} />
          <MenuDisconnectItem onClick={disconnect} />
        </MenuItems>
      </DropdownMenuComponent>
    </>
  )
}
