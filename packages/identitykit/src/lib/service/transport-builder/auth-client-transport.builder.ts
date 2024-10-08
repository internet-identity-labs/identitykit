import { Transport } from "@slide-computer/signer"
import { AuthClientTransport } from "@slide-computer/signer-transport-auth-client"

export async function getAuthClientTransportBuilder({
  maxTimeToLive,
  derivationOrigin,
}: {
  maxTimeToLive?: bigint
  derivationOrigin?: string
}): Promise<Transport> {
  return await AuthClientTransport.create({
    authClientLoginOptions: {
      maxTimeToLive,
      derivationOrigin,
    },
    authClientCreateOptions: {
      idleOptions: {
        disableIdle: true,
      },
    },
  })
}
