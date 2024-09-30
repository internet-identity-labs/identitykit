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
  const { toggleModal, user, icpBalance, disconnect, isInitializing, isUserConnecting } =
    useContext(IdentityKitContext)

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

  return (
    <>
      <DropdownMenuComponent
        disconnect={disconnect}
        icpBalance={icpBalance}
        connectedAccount={connectedAccount}
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
