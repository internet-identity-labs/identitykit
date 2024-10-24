import { useContext } from "react"
import { IdentityKitContext } from "../context"
import { AccountsSignerClient, DelegationSignerClient } from "../../../lib/signer-client"
import { IdentityKitAuthType } from "../../../lib/identity-kit"
import { useAsyncMemo } from "use-async-memo"

export function useDelegationType() {
  const ctx = useContext(IdentityKitContext)

  if (!ctx) {
    throw new Error("Identitykit Context is null")
  }

  const { signerClient, authType, user } = ctx

  const delegationType = useAsyncMemo(() => {
    if (
      !user ||
      !signerClient ||
      authType !== IdentityKitAuthType.DELEGATION ||
      signerClient instanceof AccountsSignerClient
    )
      return undefined
    return (signerClient as DelegationSignerClient).getDelegationType()
  }, [user, authType, signerClient])

  return {
    delegationType,
  }
}
