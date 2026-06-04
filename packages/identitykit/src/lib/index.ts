export { SignerAgent, type SignerAgentOptions } from "@icp-sdk/signer/agent"
export { Agent as IdentityKitAgent, type AgentOptions as IdentityKitAgentOptions } from "./agent"
export {
  SignerClient as IdentityKitSignerClient,
  DelegationSignerClient as IdentityKitDelegationSignerClient,
  AccountsSignerClient as IdentityKitAccountsSignerClient,
  DelegationType as IdentityKitDelegationType,
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
export * from "./signers"
export { uint8ArrayToBase64, base64ToUint8Array } from "@dfinity/utils"
