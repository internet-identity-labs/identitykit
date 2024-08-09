import { SignerConfig } from "../../lib/types"
import { Signer } from "@slide-computer/signer"
import { IdentityKitTheme } from "./constants"
import { IdentityKitSignerAgentOptions, IdentityKitSignerClient } from "../../lib"

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
  signerAgentOptions?: {
    signer?: IdentityKitSignerAgentOptions["signer"]
    agent?: IdentityKitSignerAgentOptions["agent"]
  }
  signerClient?: IdentityKitSignerClient
  setSignerClient: (sc?: IdentityKitSignerClient) => void
}
