import { SignerConfig } from "../../lib/types"
import { Signer } from "@slide-computer/signer"
import { IdentityKitTheme } from "./constants"
import { IdentityKitSignerAgent } from "../../lib"

export interface IdentityKitProvider {
  signers: SignerConfig[]
  featuredSigner?: SignerConfig
  selectedSigner?: Signer
  isModalOpen: boolean
  toggleModal: () => void
  selectSigner: (signerId?: string) => SignerConfig | void
  selectCustomSigner: (url: string) => void
  theme: IdentityKitTheme
  agent: IdentityKitSignerAgent | null
  connectedAccount?: string
  logout: () => unknown
  icpBalance?: number
}
