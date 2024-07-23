import { useState, useCallback, useEffect } from "react"
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
  signerAgentOptions = {},
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
}): null | IdentityKit {
  const [identityKit, setIdentityKit] = useState<null | IdentityKit>(null)
  const signerClient =
    !authKind || authKind === IdentityKitAuthKind.DELEGATION
      ? IdentityKitDelegationSignerClient
      : IdentityKitAccountsSignerClient

  const createIdentityKitSignerClient = useCallback(async () => {
    if (selectedSigner) {
      return await signerClient.create({
        signer: selectedSigner,
        keyType: "Ed25519",
        ...signerClientOptions,
      })
    }
    return null
  }, [selectedSigner])

  const createIdentityKit = useCallback(async () => {
    const signerClient = await createIdentityKitSignerClient()
    if (signerClient !== null)
      return new IdentityKit(signerClient, { signer: selectedSigner!, ...signerAgentOptions })
    return null
  }, [createIdentityKitSignerClient])

  useEffect(() => {
    createIdentityKit().then((ik) => {
      setIdentityKit(ik)
    })
  }, [createIdentityKit])

  return identityKit
}
