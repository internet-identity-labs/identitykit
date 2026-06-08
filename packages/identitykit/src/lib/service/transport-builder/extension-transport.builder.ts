import { Transport } from "@icp-sdk/signer"
import { BrowserExtensionTransport } from "@icp-sdk/signer/extension"

export async function getExtensionTransportBuilder({ uuid }: { uuid: string }): Promise<Transport> {
  return BrowserExtensionTransport.findTransport({ uuid })
}
