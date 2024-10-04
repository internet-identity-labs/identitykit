import { useContext, useEffect, useState } from "react"
import { IdentityKitContext } from "../context"
import { DelegationSignerClient, DelegationType } from "../../../lib/signer-client"
import { IdentityKitAuthType } from "../../../lib/identity-kit"

export function useDelegationType() {
  const [delegationType, setDelegetaionType] = useState<DelegationType | undefined>()
  const ctx = useContext(IdentityKitContext)

  if (!ctx) {
    throw new Error("Identitykit Context is null")
  }

  const { signerClient, authType, user } = ctx

  useEffect(() => {
    if (user) {
      if (
        authType === IdentityKitAuthType.DELEGATION &&
        signerClient instanceof DelegationSignerClient
      ) {
        ;(signerClient as DelegationSignerClient)?.getDelegationType().then(setDelegetaionType)
      }
    } else {
      setDelegetaionType(undefined)
    }
  }, [user, signerClient])

  return {
    delegationType,
  }
}
