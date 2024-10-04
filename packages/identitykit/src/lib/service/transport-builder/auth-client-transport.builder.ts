import { Transport } from "@slide-computer/signer"
import { AuthClientTransport } from "@slide-computer/signer-transport-auth-client"

export async function getAuthClientTransportBuilder({
  maxTimeToLive,
}: {
  maxTimeToLive?: bigint
}): Promise<Transport> {
  return await AuthClientTransport.create({
    authClientLoginOptions: {
      maxTimeToLive,
    },
    authClientCreateOptions: {
      idleOptions: {
        disableIdle: true,
      },
    },
  })
}
