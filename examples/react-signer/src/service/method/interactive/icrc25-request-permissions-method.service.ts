import { RPCMessage, RPCSuccessResponse, Icrc25DtoRequest } from "../../../type"
import { authService, PermissionState } from "../../auth.service"
import { permissionsService } from "../../permission.service"
import { ComponentData, InteractiveMethodService } from "./interactive-method.service"

export interface PermissionsComponentData extends ComponentData {
  permissions: string[]
}

class Icrc25RequestPermissionsMethodService extends InteractiveMethodService {
  public getMethod(): string {
    return "icrc25_request_permissions"
  }

  public async onApprove(message: MessageEvent<RPCMessage>): Promise<void> {
    return await this.savePermissionsAndRespondBack(message, PermissionState.GRANTED)
  }

  public async onReject(message: MessageEvent<RPCMessage>): Promise<void> {
    return await this.savePermissionsAndRespondBack(message, PermissionState.DENIED)
  }

  public async invokeAndGetComponentData(
    message: MessageEvent<RPCMessage>
  ): Promise<ComponentData | undefined> {
    const icrc25Message = message.data.params as unknown as Icrc25DtoRequest
    const permissionsRequest = icrc25Message.scopes.map((x) => x.method)
    const permissions = authService.filterPermissionMethodNames(permissionsRequest)

    if (permissions.length === 0) {
      await permissionsService.sendActualPermissions(message)
      return undefined
    }

    const baseData = await super.getСomponentData(message, false)
    const componentData = { ...baseData, permissions } as ComponentData
    return componentData
  }

  protected async getPermission(): Promise<PermissionState> {
    return PermissionState.GRANTED
  }

  private async savePermissionsAndRespondBack(
    message: MessageEvent<RPCMessage>,
    state: PermissionState
  ): Promise<void> {
    const icrc25Message = message.data.params as unknown as Icrc25DtoRequest
    const permissionMethodNames = icrc25Message.scopes.map((x) => x.method)

    const permissions = await authService.savePermissions(permissionMethodNames, state)
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

export const icrc25RequestPermissionsMethodService = new Icrc25RequestPermissionsMethodService()
