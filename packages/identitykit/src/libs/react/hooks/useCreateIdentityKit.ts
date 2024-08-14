import { useCallback, useEffect, useState } from "react"
import {
  IdentityKitAuthType,
  IdentityKit,
  IdentityKitAccountsSignerClient,
  IdentityKitAccountsSignerClientOptions,
  IdentityKitDelegationSignerClient,
  IdentityKitDelegationSignerClientOptions,
  IdentityKitSignerAgentOptions,
} from "../../../lib"
import { Signer } from "@slide-computer/signer"
import { AccountsSignerClient, DelegationSignerClient } from "../../../lib/signer-client"

export function useCreateIdentityKit<
  T extends IdentityKitAuthType = typeof IdentityKitAuthType.DELEGATION,
>({
  selectedSigner,
  signerClientOptions = {},
  authType,
}: {
  selectedSigner?: Signer
  authType?: T
  signerClientOptions?: T extends typeof IdentityKitAuthType.DELEGATION
    ? Omit<IdentityKitDelegationSignerClientOptions, "signer">
    : Omit<IdentityKitAccountsSignerClientOptions, "signer">
  signerAgentOptions?: {
    signer?: IdentityKitSignerAgentOptions["signer"]
    agent?: IdentityKitSignerAgentOptions["agent"]
  }
}) {
  const [signerClient, setSignerClient] = useState<
    DelegationSignerClient | AccountsSignerClient | undefined
  >()
  const signerClientClass =
    !authType || authType === IdentityKitAuthType.DELEGATION
      ? IdentityKitDelegationSignerClient
      : IdentityKitAccountsSignerClient

  const createIdentityKitSignerClient = useCallback(async () => {
    if (selectedSigner) {
      return await signerClientClass.create({
        signer: selectedSigner,
        keyType: "Ed25519",
        ...signerClientOptions,
      })
    }
    return null
  }, [selectedSigner])

  useEffect(() => {
    if (selectedSigner)
      createIdentityKitSignerClient().then((signerClient) => {
        if (signerClient) {
          IdentityKit.create(signerClient)
          setSignerClient(signerClient as DelegationSignerClient | AccountsSignerClient)
        }
      })
  }, [createIdentityKitSignerClient, selectedSigner])

  return { signerClient, setSignerClient }
}
