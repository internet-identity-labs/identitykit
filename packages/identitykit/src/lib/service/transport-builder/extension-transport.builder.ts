import { Transport } from "@slide-computer/signer"
import { PlugTransport } from "@slide-computer/signer-transport-plug"

export async function getExtensionTransportBuilder({ id }: { id?: string }): Promise<Transport> {
  switch (id) {
    case "Plug":
      return new PlugTransport()
    default:
      throw Error("The extension wallet is not supported.")
  }
}
