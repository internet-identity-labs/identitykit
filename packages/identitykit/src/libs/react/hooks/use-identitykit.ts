import { useContext } from "use-context-selector"
import { Signer } from "@slide-computer/signer"
import { SubAccount } from "@icp-sdk/canisters/ledger/icp"
import { Principal } from "@icp-sdk/core/principal"
import { type Identity } from "@icp-sdk/core/agent"
import { PartialIdentity } from "@icp-sdk/core/identity"
import { Context } from "../contexts"
import { IdentityKitAuthType, IdentityKitDelegationType } from "../../../lib"
import { useIdentity } from "./use-identity"
import { useDelegationType } from "./use-delegation-type"
import { useAccounts } from "./use-accounts"
import { ContextNotInitializedError } from "../errors"

/**
 * @deprecated This function is deprecated. Please use separate hooks instead (useUser, useBalance etc).
 */

export function useIdentityKit(): {
  signer?: Signer
  user?: {
    principal: Principal
    subaccount?: SubAccount
  }
  icpBalance?: number
  authType: IdentityKitAuthType
  delegationType?: IdentityKitDelegationType
  accounts?: {
    principal: Principal
    subAccount?: SubAccount
  }[]
  identity?: Identity | PartialIdentity
  isInitializing: boolean
  isUserConnecting: boolean
  connect: (signerIdOrUrl?: string) => void
  disconnect: () => Promise<void>
  fetchIcpBalance?: () => Promise<void>
} {
  const ctx = useContext(Context)

  if (!ctx) {
    throw new ContextNotInitializedError()
  }

  const {
    selectedSigner,
    user,
    icpBalance,
    authType,
    isInitializing,
    isUserConnecting,
    connect,
    disconnect,
    fetchIcpBalance,
  } = ctx

  const identity = useIdentity()
  const delegationType = useDelegationType()
  const accounts = useAccounts()

  return {
    signer: selectedSigner?.value,
    user,
    icpBalance,
    authType,
    accounts,
    delegationType,
    identity,
    isInitializing,
    isUserConnecting,
    connect,
    disconnect,
    fetchIcpBalance,
  }
}
