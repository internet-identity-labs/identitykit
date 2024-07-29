import { useContext, useEffect, useState, ComponentType } from "react"
import { IdentityKitContext } from "../context"
import _get from "lodash.get"
import { Button, ButtonProps } from "./button"
import { Dropdown, DropdownProps } from "./dropdown"

export function ConnectWallet({
  onError,
  buttonComponent,
  dropdownComponent,
}: {
  onError?: (e: Error) => unknown
  buttonComponent?: ComponentType<ButtonProps>
  dropdownComponent?: ComponentType<DropdownProps>
}) {
  const { selectedSigner, toggleModal, selectSigner, identityKit } = useContext(IdentityKitContext)
  const [connectedAccount, setConnectedAccount] = useState<string | undefined>()
  const [icpBalance, setIcpBalance] = useState<undefined | string>()

  const ikConnectedAccount = _get(identityKit, "signerClient.connectedUser.owner")

  useEffect(() => {
    if (selectedSigner && identityKit !== null && !connectedAccount) {
      identityKit.signerClient
        .login()
        .then(setConnectedAccount)
        .catch((e) => {
          selectSigner(undefined)
          onError?.(e)
        })
    }
  }, [selectedSigner, identityKit, connectedAccount, setConnectedAccount])

  useEffect(() => {
    setConnectedAccount(ikConnectedAccount)
  }, [ikConnectedAccount])

  useEffect(() => {
    if (connectedAccount && !icpBalance) {
      identityKit.getIcpBalance().then((b) => {
        setIcpBalance(b)
      })
    }
  }, [connectedAccount, setIcpBalance])

  const ButtonComponent = buttonComponent ?? Button
  const DropdownComponent = dropdownComponent ?? Dropdown

  if (!connectedAccount)
    return (
      <ButtonComponent
        onClick={() => {
          toggleModal()
        }}
      />
    )

  return (
    <DropdownComponent
      connectedAccount={connectedAccount}
      icpBalance={icpBalance}
      onDisconnect={() => {
        identityKit.signerClient!.logout()
        selectSigner(undefined)
      }}
    />
  )
}
