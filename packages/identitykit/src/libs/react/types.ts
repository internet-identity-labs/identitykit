import { SignerConfig } from "../../lib/types"
import { Signer } from "@slide-computer/signer"

export interface IdentityKitProvider {
  signers: SignerConfig[]
  selectedSigner?: Signer
  isModalOpen: boolean
  toggleModal: () => void
  selectSigner: (signerId?: string) => SignerConfig | void
  signerIframeRef?: React.RefObject<HTMLIFrameElement>
}
