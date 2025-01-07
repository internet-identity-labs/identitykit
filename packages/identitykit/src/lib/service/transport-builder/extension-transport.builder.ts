import { Transport } from "@slide-computer/signer"
import { BrowserExtensionTransport } from "@slide-computer/signer-extension"

export async function getExtensionTransportBuilder({ uuid }: { uuid: string }): Promise<Transport> {
  return BrowserExtensionTransport.findTransport({ uuid })
}
