import { useEffect, useState } from "react"
import { IdentityKitAuthType } from "../../../lib/identity-kit"
import { AccountsSignerClient } from "../../../lib/signer-client"
import { Principal } from "@dfinity/principal"
import { SubAccount } from "@dfinity/ledger-icp"
import { useAuthType, useSignerClient, useUser } from "./context-selectors"

export function useAccounts() {
  const authType = useAuthType()
  const signerClient = useSignerClient()
  const user = useUser()

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

  return accounts
}
