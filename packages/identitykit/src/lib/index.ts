export { SignerAgent as IdentityKitSignerAgent } from "./signer-agent"
export { SignerAgent as IdentityKitSignerRawAgent } from "@slide-computer/signer-agent"
export {
  SignerClient as IdentityKitSignerClient,
  DelegationSignerClient as IdentityKitDelegationSignerClient,
  AccountsSignerClient as IdentityKitAccountsSignerClient,
} from "./signer-client"
export * from "./identity-kit"

export {
  type SignerConfig as IdentityKitSignerConfig,
  TransportType as IdentityKitTransportType,
} from "./types"
export {
  type SignerClientOptions as IdentityKitSignerClientOptions,
  type DelegationSignerClientOptions as IdentityKitDelegationSignerClientOptions,
  type AccountsSignerClientOptions as IdentityKitAccountsSignerClientOptions,
} from "./signer-client"
export { type SignerAgentOptions as IdentityKitSignerAgentOptions } from "./signer-agent"
export { NFIDW, Plug, MockedSigner } from "./signers"
export { toBase64, fromBase64 } from "@slide-computer/signer"
