import { AccountsSignerClient, DelegationSignerClient } from "../../../lib/signer-client"
import { IdentityKitAuthType } from "../../../lib/identity-kit"
import { useAsyncMemo } from "use-async-memo"
import { useAuthType, useSignerClient, useUser } from "./context-selectors"

export function useDelegationType() {
  const signerClient = useSignerClient()
  const authType = useAuthType()
  const user = useUser()

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

  return delegationType
}
