import { RPCMessage } from "../../../type"
import { SilentMethodService } from "./silent-method.service"
import { permissionsService } from "../../permission.service"

class Icrc25PermissionsMethodService extends SilentMethodService {
  public getMethod(): string {
    return "icrc25_permissions"
  }

  public async sendResponse(message: MessageEvent<RPCMessage>): Promise<void> {
    await permissionsService.sendActualPermissions(message)
  }
}

export const icrc25PermissionsMethodService = new Icrc25PermissionsMethodService()
