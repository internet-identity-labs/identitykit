import { ComponentType } from "react"
import { ConnectButton, ConnectButtonProps } from "./connect-button"
import { ConnectedButton, ConnectedButtonProps } from "./connected-button"
import { DropdownMenu, DropdownMenuProps } from "./dropdown"
import { MenuAddressItem, MenuItems, MenuDisconnectItem } from "./dropdown/menu"
import {
  useBalance,
  useConnect,
  useDisconnect,
  useIsInitializing,
  useIsUserConnecting,
  useUser,
} from "../../hooks"

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
  const connect = useConnect()
  const disconnect = useDisconnect()
  const user = useUser()
  const { balance } = useBalance()
  const isInitializing = useIsInitializing()
  const isUserConnecting = useIsUserConnecting()

  const ConnectButtonComponent = connectButtonComponent ?? ConnectButton
  const ConnectedButtonComponent = connectedButtonComponent ?? ConnectedButton
  const DropdownMenuComponent = dropdownMenuComponent ?? DropdownMenu

  if (!user)
    return (
      <ConnectButtonComponent
        onClick={() => connect()}
        disabled={isInitializing}
        loading={isUserConnecting}
      />
    )

  const connectedAccount = user.principal.toString()

  const props = { disconnect, icpBalance: balance, connectedAccount }

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
        <ConnectedButtonComponent connectedAccount={connectedAccount} icpBalance={balance} />
        <MenuItems>
          <MenuAddressItem value={connectedAccount} />
          <MenuDisconnectItem onClick={disconnect} />
        </MenuItems>
      </DropdownMenuComponent>
    </>
  )
}
