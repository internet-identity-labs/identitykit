import { createContext } from "use-context-selector"
import { SignerConfig } from "../../../lib/types"
import { Signer } from "@slide-computer/signer"
import { IdentityKitAuthType, IdentityKitSignerClient } from "../../../lib"

import { Principal } from "@dfinity/principal"
import { SubAccount } from "@dfinity/ledger-icp"

interface Context {
  signers: SignerConfig[]
  featuredSigner?: SignerConfig
  selectedSigner?: Signer
  isModalOpen: boolean
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
  connect: (signerIdOrUrl?: string) => void
  disconnect: () => Promise<void>
  fetchIcpBalance?: () => Promise<void>
}

export const Context = createContext<Context | null>(null)
