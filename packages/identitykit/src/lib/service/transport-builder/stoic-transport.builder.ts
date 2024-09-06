import { Transport } from "@slide-computer/signer"
import { StoicTransport } from "@slide-computer/signer-transport-stoic"

export async function getStoicTransportBuilder(): Promise<Transport> {
  return await StoicTransport.create({})
}
