import { Transport } from "@slide-computer/signer"
import { PlugTransport } from "@slide-computer/signer-transport-plug"
import { PrimeVaultTransport } from "@primevault/signer-transport-primevault"

export async function getExtensionTransportBuilder({ id }: { id?: string }): Promise<Transport> {
  switch (id) {
    case "Plug":
      return new PlugTransport()
    case "PrimeVault":
      return new PrimeVaultTransport()
    default:
      throw Error("The extension wallet is not supported.")
  }
}
