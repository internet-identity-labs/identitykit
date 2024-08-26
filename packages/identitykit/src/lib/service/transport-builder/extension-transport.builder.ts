import { Transport } from "@slide-computer/signer"
import { PlugTransport } from "@slide-computer/signer-transport-plug"

export function getExtensionTransportBuilder(): Transport {
  return new PlugTransport()
}
