import { Transport } from "@slide-computer/signer"
import { PlugTransport } from "@slide-computer/signer-transport-plug"
import { TransportBuilderRequest } from "./transport.builder"

export async function getExtensionTransportBuilder({
  id,
}: TransportBuilderRequest): Promise<Transport> {
  switch (id) {
    case "Plug":
      return new PlugTransport()
    default:
      throw Error("The extension wallet is not supported.")
  }
}
