import { RPCMessage, RPCSuccessResponse, Icrc25DtoRequest } from "../../../type"
import { authService, PermissionState } from "../../auth.service"
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
    const permissionMethodNames = icrc25Message.scopes.map((x) => x.method)

    const permissions = await authService.savePermissions(
      permissionMethodNames,
      PermissionState.GRANTED
    )
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

  public async onReject(message: MessageEvent<RPCMessage>): Promise<void> {
    const icrc25Message = message.data.params as unknown as Icrc25DtoRequest
    const permissions = icrc25Message.scopes.map((x) => x.method)

    await authService.savePermissions(permissions, PermissionState.DENIED)

    await super.onReject(message)
  }

  public async getСomponentData(
    message: MessageEvent<RPCMessage>
  ): Promise<PermissionsComponentData> {
    const icrc25Message = message.data.params as unknown as Icrc25DtoRequest
    const permissions = icrc25Message.scopes.map((el) => el.method)

    authService.validatePermissionMethodNames(permissions)

    const baseData = await super.getСomponentData(message)

    return {
      ...baseData,
      permissions,
    }
  }
}

export const icrc25RequestPermissionsMethodService = new Icrc25RequestPermissionsMethodService()
