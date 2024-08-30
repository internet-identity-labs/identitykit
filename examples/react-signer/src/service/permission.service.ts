import { RPCMessage, RPCSuccessResponse } from "../type"
import { authService } from "./auth.service"

export const permissionsService = {
  async sendActualPermissions(message: MessageEvent<RPCMessage>) {
    const permissionsOld = await authService.getPermissions()
    const scopes = Object.entries(permissionsOld).map(([key, value]) => {
      return { scope: { method: key }, state: value }
    })

    const response: RPCSuccessResponse = {
      origin: message.origin,
      jsonrpc: message.data.jsonrpc,
      id: message.data.id,
      result: { scopes },
    }

    window.opener.postMessage(response, message.origin)
  },
}
