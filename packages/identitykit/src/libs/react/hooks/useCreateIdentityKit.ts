import { useCallback, useEffect, useState } from "react"
import {
  IdentityKitAuthKindType,
  IdentityKit,
  IdentityKitAccountsSignerClient,
  IdentityKitAccountsSignerClientOptions,
  IdentityKitAuthKind,
  IdentityKitDelegationSignerClient,
  IdentityKitDelegationSignerClientOptions,
  IdentityKitSignerAgentOptions,
} from "../../../lib"
import { Signer } from "@slide-computer/signer"

export function useCreateIdentityKit<
  T extends IdentityKitAuthKindType = typeof IdentityKitAuthKind.DELEGATION,
>({
  selectedSigner,
  signerClientOptions = {},
  authKind,
}: {
  selectedSigner?: Signer
  authKind?: T
  signerClientOptions?: T extends typeof IdentityKitAuthKind.DELEGATION
    ? Omit<IdentityKitDelegationSignerClientOptions, "signer">
    : Omit<IdentityKitAccountsSignerClientOptions, "signer">
  signerAgentOptions?: {
    signer?: IdentityKitSignerAgentOptions["signer"]
    agent?: IdentityKitSignerAgentOptions["agent"]
  }
}) {
  const [signerClient, setSignerClient] = useState<IdentityKitAccountsSignerClient | undefined>()
  const signerClientClass =
    !authKind || authKind === IdentityKitAuthKind.DELEGATION
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
          setSignerClient(signerClient)
        }
      })
  }, [createIdentityKitSignerClient, selectedSigner])

  return { signerClient, setSignerClient }
}
