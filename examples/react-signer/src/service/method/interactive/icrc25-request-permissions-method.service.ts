import {
  RPCMessage,
  RPCSuccessResponse,
  Icrc25DtoRequest,
  Icrc25DtoResponse,
  ScopeResponse,
} from "../../../type"
import { authService } from "../../auth.service"
import { ComponentData, InteractiveMethodService } from "./interactive-method.service"

export interface PermissionsComponentData extends ComponentData {
  permissions: string[]
}

class Icrc25RequestPermissionsMethodService extends InteractiveMethodService {
  public getMethod(): string {
    return "icrc25_request_permissions"
  }

  protected async isAuthorized(): Promise<boolean> {
    return true
  }

  public async onApprove(message: MessageEvent<RPCMessage>): Promise<void> {
    const icrc25Message = message.data.params as unknown as Icrc25DtoRequest
    const permissions = icrc25Message.scopes.map((x) => x.method)

    await authService.savePermissions(permissions)

    const scopes: ScopeResponse[] = permissions.map((x) => {
      return { scope: { method: x }, state: "granted" }
    })

    const response: RPCSuccessResponse = {
      origin: message.origin,
      jsonrpc: message.data.jsonrpc,
      id: message.data.id,
      result: { scopes },
    }

    window.opener.postMessage(response, message.origin)
  }

  public async getСomponentData(
    message: MessageEvent<RPCMessage>
  ): Promise<PermissionsComponentData> {
    const icrc25Message = message.data.params as unknown as Icrc25DtoRequest
    const permissions = icrc25Message.scopes.map((el) => el.method)
    const baseData = await super.getСomponentData(message)
    return {
      ...baseData,
      permissions,
    }
  }
}

export const icrc25RequestPermissionsMethodService = new Icrc25RequestPermissionsMethodService()
