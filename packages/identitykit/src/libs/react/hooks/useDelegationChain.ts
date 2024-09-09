import { useContext, useEffect, useState } from "react"
import { IdentityKitContext } from "../context"
import { IdentityKitAuthType } from "../../../lib/identity-kit"
import { DelegationSignerClient } from "../../../lib/signer-client"
import { DelegationChain } from "@dfinity/identity"

export function useDelegationChain() {
  const { authType, signerClient } = useContext(IdentityKitContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()
  const [delegationChain, setDelegationChain] = useState<DelegationChain | undefined>()

  useEffect(() => {
    if (!signerClient?.connectedUser) {
      setError(undefined)
      setDelegationChain(undefined)
    }
  }, [signerClient?.connectedUser])

  return {
    getDelegationChain: async () => {
      if (!signerClient?.connectedUser) return setError(new Error("Not authorized"))

      if (authType !== IdentityKitAuthType.DELEGATION) {
        return setError(new Error("getDelegationChain is not allowed with accounts auth type"))
      }

      if (delegationChain) return delegationChain

      setError(undefined)
      setLoading(true)
      const response = await (signerClient as DelegationSignerClient).getDelegationChain()
      setLoading(false)
      setDelegationChain(response)

      return response
    },
    delegationChainLoading: loading,
    delegationChain,
    delegeationChainError: error,
  }
}
