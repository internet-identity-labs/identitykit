import { SignerConfig } from "../../lib/types"
import { Signer } from "@slide-computer/signer"
import { IdentityKitTheme } from "./constants"
import { IdentityKitSignerAgentOptions } from "../../lib"
import { AccountsSignerClient, DelegationSignerClient } from "../../lib/signer-client"

export interface IdentityKitProvider {
  signers: SignerConfig[]
  featuredSigner?: SignerConfig
  selectedSigner?: Signer
  savedSigner?: Signer
  isModalOpen: boolean
  toggleModal: () => void
  selectSigner: (signerId?: string) => SignerConfig | void
  selectCustomSigner: (url: string) => void
  theme: IdentityKitTheme
  signerAgentOptions?: {
    signer?: IdentityKitSignerAgentOptions["signer"]
    agent?: IdentityKitSignerAgentOptions["agent"]
  }
  signerClient?: DelegationSignerClient | AccountsSignerClient
  setSignerClient: (sc?: DelegationSignerClient | AccountsSignerClient) => void
  shouldLogoutByIdle?: boolean
}
