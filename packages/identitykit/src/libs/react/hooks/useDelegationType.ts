import { useContext, useEffect, useState } from "react"
import { IdentityKitContext } from "../context"
import { DelegationSignerClient, DelegationType } from "../../../lib/signer-client"
import { IdentityKitAuthType } from "../../../lib/identity-kit"

export function useDelegationType() {
  const [delegationType, setDelegetaionType] = useState<DelegationType | undefined>()
  const { signerClient, authType, user } = useContext(IdentityKitContext)

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
