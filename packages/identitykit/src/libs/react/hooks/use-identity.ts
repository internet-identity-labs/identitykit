import { useMemo } from "react"
import { AccountsSignerClient, DelegationSignerClient } from "../../../lib/signer-client"
import { IdentityKitAuthType } from "../../../lib/identity-kit"
import { useAuthType, useSignerClient } from "./context-selectors"

export function useIdentity() {
  const signerClient = useSignerClient()
  const authType = useAuthType()

  const identity = useMemo(
    () =>
      authType === IdentityKitAuthType.ACCOUNTS || signerClient instanceof AccountsSignerClient
        ? undefined
        : (signerClient as DelegationSignerClient)?.getIdentity(),
    [authType, signerClient]
  )

  return identity
}
