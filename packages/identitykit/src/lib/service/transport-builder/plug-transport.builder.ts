import { Transport } from "@slide-computer/signer"
import { PlugTransport } from "@slide-computer/signer-transport-plug"

export async function getPlugTransportBuilder(): Promise<Transport> {
  return new PlugTransport()
}
