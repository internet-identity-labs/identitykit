import { Transport } from "@slide-computer/signer"
import { PostMessageTransport, PostMessageTransportOptions } from "@slide-computer/signer-web"

export async function getPopupTransportBuilder(
  options: PostMessageTransportOptions
): Promise<Transport> {
  return new PostMessageTransport({
    ...options,
    establishTimeout: 15000,
  })
}
