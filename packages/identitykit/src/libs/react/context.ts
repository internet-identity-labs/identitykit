import { createContext, useContext } from "react"
import { IdentityKitProvider } from "./types"
import { Signer } from "@slide-computer/signer"
import { IdentityKit, SignerConfig } from "../../lib"
import { IdentityKitTheme } from "./constants"

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identityKit: {} as any,
}

export const IdentityKitContext = createContext<IdentityKitProvider>(defaultState)

export function useIdentityKit(): {
  selectedSigner?: Signer
  selectSigner: (signerId?: string | undefined) => void | SignerConfig
  identityKit: IdentityKit
} {
  const { selectedSigner, selectSigner, identityKit } = useContext(IdentityKitContext)

  return {
    selectedSigner,
    selectSigner,
    identityKit,
  }
}
