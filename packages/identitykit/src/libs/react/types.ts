import { SignerConfig } from "../../lib/types"
import { Signer } from "@slide-computer/signer"
import { IdentityKitTheme } from "./constants"
import { IdentityKit } from "../../lib/identity-kit"

export interface IdentityKitProvider {
  signers: SignerConfig[]
  selectedSigner?: Signer
  savedSigner?: Signer
  isModalOpen: boolean
  toggleModal: () => void
  selectSigner: (signerId?: string) => SignerConfig | void
  selectCustomSigner: (url: string) => void
  signerIframeRef?: React.RefObject<HTMLIFrameElement>
  theme: IdentityKitTheme
  identityKit: IdentityKit
}
