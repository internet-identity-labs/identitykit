import { useContext, useEffect, useState } from "react"
import { IdentityKitContext } from "../context"
import { IdentityKitAuthType } from "../../../lib/identity-kit"
import { AccountsSignerClient } from "../../../lib/signer-client"
import { Principal } from "@dfinity/principal"

export function useAccounts() {
  const { authType, signerClient } = useContext(IdentityKitContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()
  const [accounts, setAccounts] = useState<
    | {
        owner: Principal
        subaccount: ArrayBuffer | undefined
      }[]
    | undefined
  >()

  useEffect(() => {
    if (!signerClient?.connectedUser) {
      setError(undefined)
      setAccounts(undefined)
    }
  }, [signerClient?.connectedUser])

  return {
    getAccounts: async () => {
      if (!signerClient?.connectedUser) return setError(new Error("Not authorized"))

      if (authType !== IdentityKitAuthType.ACCOUNTS) {
        return setError(new Error("getAccounts is not allowed with accounts auth type"))
      }

      if (accounts) return accounts

      setError(undefined)
      setLoading(true)
      const response = await (signerClient as AccountsSignerClient).getAccounts()
      setLoading(false)
      setAccounts(response)

      return response
    },
    accountsLoading: loading,
    accounts,
    accountsError: error,
  }
}
