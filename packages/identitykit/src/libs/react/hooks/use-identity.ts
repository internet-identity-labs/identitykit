import { useContext, useMemo } from "react"
import { IdentityKitContext } from "../context"
import { AccountsSignerClient, DelegationSignerClient } from "../../../lib/signer-client"
import { IdentityKitAuthType } from "../../../lib/identity-kit"

export function useIdentity() {
  const ctx = useContext(IdentityKitContext)

  if (!ctx) {
    throw new Error("Identitykit Context is null")
  }

  const { signerClient, authType } = ctx

  const identity = useMemo(
    () =>
      authType === IdentityKitAuthType.ACCOUNTS || signerClient instanceof AccountsSignerClient
        ? undefined
        : (signerClient as DelegationSignerClient)?.getIdentity(),
    [authType, signerClient]
  )

  return {
    identity,
  }
}
