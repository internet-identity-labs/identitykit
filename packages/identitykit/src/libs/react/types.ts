import { Signer } from "@slide-computer/signer"
import { Principal } from "@dfinity/principal"
import { SubAccount } from "@dfinity/ledger-icp"

import { IdentityKitAuthType, IdentityKitSignerClient } from "../../lib"
import { SignerConfig } from "../../lib/types"
import { IdentityKitTheme } from "./constants"

export interface IdentityKitProvider {
  signers: SignerConfig[]
  featuredSigner?: SignerConfig
  selectedSigner?: Signer
  isModalOpen: boolean
  theme: IdentityKitTheme
  user?: {
    principal: Principal
    subAccount?: SubAccount
  }
  icpBalance?: number
  authType: IdentityKitAuthType
  signerClient?: IdentityKitSignerClient
  isInitializing: boolean
  isUserConnecting: boolean
  toggleModal: () => void
  selectSigner: (signerId?: string) => Promise<SignerConfig | void>
  selectCustomSigner: (url: string) => Promise<void>
  connect: () => void
  disconnect: () => Promise<void>
  fetchIcpBalance?: () => Promise<void>
}
