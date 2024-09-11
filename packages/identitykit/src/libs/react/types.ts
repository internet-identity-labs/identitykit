import { SignerConfig } from "../../lib/types"
import { Signer } from "@slide-computer/signer"
import { IdentityKitTheme } from "./constants"
import { Principal } from "@dfinity/principal"
import { IdentityKitAuthType, IdentityKitSignerAgent, IdentityKitSignerClient } from "../../lib"
import { SubAccount } from "@dfinity/ledger-icp"

export interface IdentityKitProvider {
  signers: SignerConfig[]
  featuredSigner?: SignerConfig
  selectedSigner?: Signer
  isModalOpen: boolean
  toggleModal: () => void
  selectSigner: (signerId?: string) => Promise<SignerConfig | void>
  selectCustomSigner: (url: string) => Promise<void>
  theme: IdentityKitTheme
  agent: IdentityKitSignerAgent<Signer> | null
  user?: {
    principal: Principal
    subAccount?: SubAccount
  }
  disconnect: () => unknown
  icpBalance?: number
  authType: IdentityKitAuthType
  signerClient?: IdentityKitSignerClient
}
