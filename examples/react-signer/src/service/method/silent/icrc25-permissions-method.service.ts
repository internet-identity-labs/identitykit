import { Icrc25Dto, RPCMessage, RPCSuccessResponse, Scope } from "../../../type"
import { SilentMethodService } from "./silent-method.service"
import { authService } from "../../auth.service"

class Icrc25PermissionsMethodService extends SilentMethodService {
  public getMethod(): string {
    return "icrc25_permissions"
  }

  public async sendResponse(message: MessageEvent<RPCMessage>): Promise<void> {
    const permissions = await authService.getPermissions()
    const scopes: Scope[] = permissions.map((x) => {
      return { method: x }
    })
    const icrc25: Icrc25Dto = {
      scopes,
    }

    const response: RPCSuccessResponse = {
      origin: message.origin,
      jsonrpc: message.data.jsonrpc,
      id: message.data.id,
      result: icrc25,
    }

    window.opener.postMessage(response, message.origin)
  }
}

export const icrc25PermissionsMethodService = new Icrc25PermissionsMethodService()
