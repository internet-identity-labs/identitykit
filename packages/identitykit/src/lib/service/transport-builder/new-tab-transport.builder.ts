import { Transport } from "@slide-computer/signer"
import { PostMessageTransport, PostMessageTransportOptions } from "@slide-computer/signer-web"

export const NEW_TAB_TRANSPORT_DEFAULT_ESTABLISH_TIMEOUT = 60000 // 1 min

export async function getPopupTransportBuilder(
  options: PostMessageTransportOptions
): Promise<Transport> {
  return new PostMessageTransport({
    ...options,
    detectNonClickEstablishment: false,
    statusPollingRate: 1000,
    disconnectTimeout: 5000,
    establishTimeout: NEW_TAB_TRANSPORT_DEFAULT_ESTABLISH_TIMEOUT, // 1 min
  })
}
