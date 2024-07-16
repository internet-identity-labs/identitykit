import { createContext, useContext } from "react"
import { IdentityKitProvider } from "./types"
import { Signer } from "@slide-computer/signer"

const defaultState: IdentityKitProvider = {
  signers: [],
  selectedSigner: undefined,
  isModalOpen: false,
  signerIframeRef: undefined,
  toggleModal: () => {
    throw new Error("toggleModal not implemented")
  },
  selectSigner: () => {
    throw new Error("selectSigner not implemented")
  },
  setCustomSigner: () => {
    throw new Error("signer is not available on this url")
  },
}

export const IdentityKitContext = createContext<IdentityKitProvider>(defaultState)

export function useIdentityKit(): {
  selectedSigner?: Signer
} {
  const { selectedSigner } = useContext(IdentityKitContext)

  return {
    selectedSigner,
  }
}
