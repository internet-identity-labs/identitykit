import { createContext, useContext } from "react"
import { IdentityKitProvider } from "./types"
import { Signer } from "@slide-computer/signer"
import { SignerAgent } from "@slide-computer/signer-agent"
import { IdentityKitAuthType } from "../../lib/identity-kit"
import { SubAccount } from "@dfinity/ledger-icp"
import { Principal } from "@dfinity/principal"
import { useAccounts, useDelegationType, useIdentity } from "./hooks"
import { IdentityKitDelegationType } from "../../lib"
import { type Identity } from "@dfinity/agent"
import { PartialIdentity } from "@dfinity/identity"

export const IdentityKitContext = createContext<IdentityKitProvider | null>(null)

export function useIdentityKit(): {
  signer?: Signer
  agent: SignerAgent<Signer> | null
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
  connect: () => void
  disconnect: () => Promise<void>
  fetchIcpBalance?: () => Promise<void>
} {
  const ctx = useContext(IdentityKitContext)

  if (!ctx) {
    throw new Error("Identitykit Context is null")
  }

  const {
    selectedSigner,
    agent,
    user,
    icpBalance,
    authType,
    isInitializing,
    isUserConnecting,
    connect,
    disconnect,
    fetchIcpBalance,
  } = ctx

  const { identity } = useIdentity()
  const { delegationType } = useDelegationType()
  const { accounts } = useAccounts()

  return {
    signer: selectedSigner,
    agent,
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
