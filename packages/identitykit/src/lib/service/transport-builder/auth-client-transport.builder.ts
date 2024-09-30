import { Transport } from "@slide-computer/signer"
import { AuthClientTransport } from "@slide-computer/signer-transport-auth-client"

export async function getAuthClientTransportBuilder(): Promise<Transport> {
  return await AuthClientTransport.create({
    authClientCreateOptions: {
      idleOptions: {
        disableIdle: true,
      },
    },
  })
}
