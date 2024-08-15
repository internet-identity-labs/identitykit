import { createContext, useContext } from "react"
import { IdentityKitProvider } from "./types"
import { Signer } from "@slide-computer/signer"
import {
  IdentityKit,
  IdentityKitSignerAgent,
  IdentityKitSignerAgentOptions,
  SignerConfig,
} from "../../lib"
import { IdentityKitTheme } from "./constants"
import { AccountsSignerClient, DelegationSignerClient } from "../../lib/signer-client"

const defaultState: IdentityKitProvider = {
  signers: [],
  selectedSigner: undefined,
  savedSigner: undefined,
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
  agentOptions: {} as {
    signer?: IdentityKitSignerAgentOptions["signer"]
    agent?: IdentityKitSignerAgentOptions["agent"]
  },
  setSignerClient: () => {
    throw new Error("setSignerClient not implemented")
  },
}

export const IdentityKitContext = createContext<IdentityKitProvider>(defaultState)

export function useIdentityKit(): {
  selectedSigner?: Signer
  savedSigner?: Signer
  selectSigner: (signerId?: string | undefined) => void | SignerConfig
  signerClient?: DelegationSignerClient | AccountsSignerClient
  agent: IdentityKitSignerAgent
} {
  const { selectedSigner, selectSigner, signerClient, savedSigner } = useContext(IdentityKitContext)

  return {
    selectedSigner,
    savedSigner,
    selectSigner,
    signerClient,
    agent: IdentityKit.signerAgent,
  }
}
