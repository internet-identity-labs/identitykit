import { Transport } from "@slide-computer/signer"
import { TransportBuilderRequest } from "./transport.builder"
import { PostMessageTransport } from "@slide-computer/signer-web"

export async function getPopupTransportBuilder({
  url,
  crypto,
}: TransportBuilderRequest): Promise<Transport> {
  return new PostMessageTransport({
    url,
    crypto: crypto ?? globalThis.crypto,
  })
}
