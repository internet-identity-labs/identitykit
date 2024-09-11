import { useContext } from "react"
import { IdentityKitContext } from "../context"
import { AccountsSignerClient, DelegationSignerClient } from "../../../lib/signer-client"
import { IdentityKitAuthType } from "../../../lib/identity-kit"

export function useIdentity() {
  const { signerClient, authType } = useContext(IdentityKitContext)

  return {
    identity:
      authType === IdentityKitAuthType.ACCOUNTS || signerClient instanceof AccountsSignerClient
        ? undefined
        : (signerClient as DelegationSignerClient)?.getIdentity(),
  }
}
