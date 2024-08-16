import { RPCMessage, RPCSuccessResponse } from "../../../type"
import { SilentMethodService } from "./silent-method.service"
import { authService } from "../../auth.service"

class Icrc25PermissionsMethodService extends SilentMethodService {
  public getMethod(): string {
    return "icrc25_permissions"
  }

  public async sendResponse(message: MessageEvent<RPCMessage>): Promise<void> {
    const permissions = await authService.getPermissions()
    const scopes = Object.entries(permissions).map(([key, value]) => {
      return { scope: { method: key }, state: value }
    })

    const response: RPCSuccessResponse = {
      origin: message.origin,
      jsonrpc: message.data.jsonrpc,
      id: message.data.id,
      result: { scopes },
    }

    window.opener.postMessage(response, message.origin)
  }
}

export const icrc25PermissionsMethodService = new Icrc25PermissionsMethodService()
