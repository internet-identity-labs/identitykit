import { Transport } from "@slide-computer/signer"
import { TransportBuilderRequest } from "./transport.builder"

export function getIframeTransportBuilder(_: TransportBuilderRequest): Transport {
  throw new Error("getIframeTransport function not implemented.")
}
