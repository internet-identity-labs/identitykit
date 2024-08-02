import { Transport } from "@slide-computer/signer"
import { TransportBuilderRequest } from "./transport.builder"

export function getExtensionTransportBuilder(_: TransportBuilderRequest): Transport {
  throw new Error("getExtensionTransport function not implemented.")
}
