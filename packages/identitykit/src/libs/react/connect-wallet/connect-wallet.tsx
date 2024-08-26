import { useContext, useEffect, useState, ComponentType, useCallback, ReactNode } from "react"
import { IdentityKitContext } from "../context"
import { ConnectButton, ConnectButtonProps } from "./connect-button"
import { ConnectedButton, ConnectedButtonProps } from "./connected-button"
import { DropdownMenu, DropdownMenuProps } from "./dropdown"
import { IdentityKit } from "../../../lib/identity-kit"
import { Principal } from "@dfinity/principal"
import { MenuButton, MenuButtonProps } from "@headlessui/react"
import { MenuAddressItem, MenuItems, MenuLogoutItem } from "./dropdown/menu"

export function ConnectWallet({
  onConnectFailure,
  onConnectSuccess,
  onDisconnect,
  connectButtonComponent,
  connectedButtonComponent,
  dropdownMenuComponent,
  triggerManualDisconnect,
}: {
  onConnectFailure?: (e: Error) => unknown
  onConnectSuccess?: (signerResponse: object) => unknown
  onDisconnect?: () => unknown
  connectButtonComponent?: ComponentType<ConnectButtonProps>
  connectedButtonComponent?: ComponentType<ConnectedButtonProps>
  dropdownMenuComponent?: ComponentType<DropdownMenuProps>
  triggerManualDisconnect?: boolean
}) {
  const {
    selectedSigner,
    savedSigner,
    toggleModal,
    selectSigner,
    agentOptions,
    signerClient,
    setSignerClient,
    shouldLogoutByIdle,
  } = useContext(IdentityKitContext)
  const [icpBalance, setIcpBalance] = useState<undefined | number>()

  const connectedAccount = signerClient?.connectedUser?.owner

  useEffect(() => {
    if (selectedSigner && signerClient && !connectedAccount) {
      signerClient
        .login()
        .then(async (res) => {
          await IdentityKit.setSignerAgent({
            ...agentOptions,
            signer: selectedSigner,
            account: Principal.from(res.connectedAccount),
          })
          onConnectSuccess?.(res.signerResponse)
        })
        .catch((e) => {
          selectSigner(undefined)
          onConnectFailure?.(e)
        })
    }
  }, [selectedSigner, connectedAccount, signerClient])

  useEffect(() => {
    if (!selectedSigner && savedSigner && signerClient?.connectedUser?.owner) {
      IdentityKit.setSignerAgent({
        ...agentOptions,
        signer: savedSigner,
        account: Principal.fromText(signerClient?.connectedUser?.owner),
      })
    }
  }, [selectedSigner, savedSigner, signerClient])

  useEffect(() => {
    if (connectedAccount && signerClient && !icpBalance) {
      IdentityKit.getIcpBalance().then((b) => {
        setIcpBalance(b)
      })
    }
  }, [setIcpBalance, signerClient, connectedAccount])

  const disconnect = useCallback(() => {
    signerClient?.logout()
    IdentityKit.signerClient = undefined
    setSignerClient(undefined)
    selectSigner(undefined)
    onDisconnect?.()
    setIcpBalance(undefined)
  }, [
    signerClient,
    setSignerClient,
    IdentityKit.signerClient,
    selectSigner,
    onDisconnect,
    setIcpBalance,
  ])

  useEffect(() => {
    if (triggerManualDisconnect || shouldLogoutByIdle) disconnect()
  }, [triggerManualDisconnect, shouldLogoutByIdle])

  const ConnectButtonComponent = connectButtonComponent ?? ConnectButton
  const ConnectedButtonComponent = connectedButtonComponent ?? ConnectedButton
  const DropdownMenuComponent = dropdownMenuComponent ?? DropdownMenu

  if (!connectedAccount)
    return (
      <ConnectButtonComponent
        onClick={() => {
          toggleModal()
        }}
      />
    )

  return (
    <>
      <DropdownMenuComponent>
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
          <MenuLogoutItem onClick={disconnect} />
        </MenuItems>
      </DropdownMenuComponent>
    </>
  )
}
