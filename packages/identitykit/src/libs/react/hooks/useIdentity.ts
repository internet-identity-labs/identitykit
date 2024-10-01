import { useContext, useMemo } from "react"
import { IdentityKitContext } from "../context"
import { AccountsSignerClient, DelegationSignerClient } from "../../../lib/signer-client"
import { IdentityKitAuthType } from "../../../lib/identity-kit"

export function useIdentity() {
  const { signerClient, authType } = useContext(IdentityKitContext)

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
