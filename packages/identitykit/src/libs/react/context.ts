import { createContext, useContext } from "react"
import { IdentityKitProvider } from "./types"
import { Signer } from "@slide-computer/signer"
import { IdentityKitTheme } from "./constants"
import { SignerAgent } from "@slide-computer/signer-agent"
import { IdentityKitAuthType } from "../../lib/identity-kit"
import { SubAccount } from "@dfinity/ledger-icp"
import { Principal } from "@dfinity/principal"
import { useAccounts, useDelegationType, useIdentity } from "./hooks"
import { IdentityKitDelegationType } from "../../lib"
import { type Identity } from "@dfinity/agent"
import { PartialIdentity } from "@dfinity/identity"

const defaultState: IdentityKitProvider = {
  signers: [],
  selectedSigner: undefined,
  isModalOpen: false,
  toggleModal: () => {
    throw new Error("toggleModal not implemented")
  },
  selectSigner: () => {
    throw new Error("selectSigner not implemented")
  },
  selectCustomSigner: () => {
    throw new Error("signer is not available on this url")
  },
  theme: IdentityKitTheme.SYSTEM,
  disconnect: () => {
    throw new Error("disconnect not implemented")
  },
  connect: () => {
    throw new Error("connect not implemented")
  },
  agent: null,
  authType: IdentityKitAuthType.ACCOUNTS,
}

export const IdentityKitContext = createContext<IdentityKitProvider>(defaultState)

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
  connect: () => void
  disconnect: () => Promise<void>
  fetchIcpBalance?: () => Promise<void>
} {
  const {
    selectedSigner,
    agent,
    user,
    icpBalance,
    authType,
    connect,
    disconnect,
    fetchIcpBalance,
  } = useContext(IdentityKitContext)

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
    connect,
    disconnect,
    fetchIcpBalance,
  }
}
