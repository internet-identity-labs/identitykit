import { Transport } from "@slide-computer/signer"
import { TransportBuilderRequest } from "./transport.builder"
import { PostMessageTransport } from "@slide-computer/signer-web"
import { openPopup } from "../../../libs/react/utils"

export function getPopupTransportBuilder({ url, crypto }: TransportBuilderRequest): Transport {
  return new PostMessageTransport({
    openWindow: () => openPopup(url),
    crypto: crypto ?? globalThis.crypto,
  })
}
