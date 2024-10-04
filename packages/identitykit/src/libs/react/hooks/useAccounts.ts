import { useContext, useEffect, useState } from "react"
import { IdentityKitContext } from "../context"
import { IdentityKitAuthType } from "../../../lib/identity-kit"
import { AccountsSignerClient } from "../../../lib/signer-client"
import { Principal } from "@dfinity/principal"
import { SubAccount } from "@dfinity/ledger-icp"

export function useAccounts() {
  const ctx = useContext(IdentityKitContext)

  if (!ctx) {
    throw new Error("Identitykit Context is null")
  }

  const { authType, signerClient, user } = ctx

  const [accounts, setAccounts] = useState<
    | {
        principal: Principal
        subAccount?: SubAccount
      }[]
    | undefined
  >()

  useEffect(() => {
    if (!user) {
      setAccounts(undefined)
    } else {
      if (
        authType === IdentityKitAuthType.ACCOUNTS &&
        !accounts &&
        signerClient instanceof AccountsSignerClient
      ) {
        ;(signerClient as AccountsSignerClient)?.getAccounts().then(setAccounts)
      }
    }
  }, [user, authType, signerClient])

  return {
    accounts,
  }
}
