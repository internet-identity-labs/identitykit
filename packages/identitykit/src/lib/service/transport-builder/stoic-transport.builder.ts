import { Transport } from "@slide-computer/signer"
import { StoicTransport } from "@slide-computer/signer-transport-stoic"

export async function getStoicTransportBuilder({
  maxTimeToLive,
}: {
  maxTimeToLive?: bigint
}): Promise<Transport> {
  return await StoicTransport.create({ maxTimeToLive })
}
