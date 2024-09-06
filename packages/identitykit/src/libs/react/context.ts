import { createContext, useContext } from "react"
import { IdentityKitProvider } from "./types"
import { Signer } from "@slide-computer/signer"
import { IdentityKitTheme } from "./constants"
import { SignerConfig } from "../../lib/types"
import { SignerAgent } from "@slide-computer/signer-agent"

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
  agent: null,
}

export const IdentityKitContext = createContext<IdentityKitProvider>(defaultState)

export function useIdentityKit(): {
  selectedSigner?: Signer
  selectSigner: (signerId?: string | undefined) => Promise<void | SignerConfig>
  agent: SignerAgent<Signer> | null
  connectedAccount?: string
  disconnect: () => unknown
  icpBalance?: number
} {
  const { selectedSigner, selectSigner, agent, connectedAccount, disconnect, icpBalance } =
    useContext(IdentityKitContext)

  return {
    selectedSigner,
    selectSigner,
    agent,
    connectedAccount,
    disconnect,
    icpBalance,
  }
}
