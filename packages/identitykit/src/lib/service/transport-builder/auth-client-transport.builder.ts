import { Transport } from "@slide-computer/signer"
import {
  AuthClientTransport,
  AuthClientTransportOptions,
} from "@slide-computer/signer-transport-auth-client"

export async function getAuthClientTransportBuilder(
  options: AuthClientTransportOptions
): Promise<Transport> {
  return await AuthClientTransport.create({
    ...options,
    authClientCreateOptions: {
      ...options.authClientCreateOptions,
      idleOptions: {
        disableIdle: true,
      },
    },
  })
}
