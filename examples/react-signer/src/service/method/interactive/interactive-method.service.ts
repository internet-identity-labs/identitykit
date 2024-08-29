import { RPCMessage, RPCErrorResponse } from "../../../type"
import { authService, PermissionState } from "../../auth.service"
import {
  NotSupportedError,
  PermissionNotGranted,
  exceptionHandlerService,
} from "../../exception-handler.service"
import { MethodService } from "../method.servcie"

export interface ComponentData {
  method: string
  origin: string
  isAskOnUse: boolean
  onApprovePermission: () => Promise<void>
  onApprove: (data?: unknown) => Promise<void>
  onReject: () => Promise<void>
}

export abstract class InteractiveMethodService implements MethodService {
  public abstract getMethod(): string
  public abstract onApprove(message: MessageEvent<RPCMessage>, data?: unknown): Promise<void>

  public async invokeAndGetComponentData(
    message: MessageEvent<RPCMessage>
  ): Promise<ComponentData | undefined> {
    const permission = await this.getPermission()

    const isAskOnUse = permission === PermissionState.ASK_ON_USE

    const componentData = this.getСomponentData(message, isAskOnUse)
    if (!componentData) {
      throw new NotSupportedError()
    }

    return componentData
  }

  public async getСomponentData(
    message: MessageEvent<RPCMessage>,
    isAskOnUse: boolean
  ): Promise<ComponentData> {
    return {
      method: message.data.method,
      origin: message.origin,
      isAskOnUse,
      onApprovePermission: async () => {
        await authService.savePermissions([this.getMethod()], PermissionState.GRANTED)
      },
      onApprove: async (data?: unknown) => {
        try {
          await this.onApprove(message, data)
        } catch (error) {
          exceptionHandlerService.handle(error, message)
        }
      },
      onReject: () => this.onReject(message),
    }
  }

  protected async getPermission(): Promise<PermissionState> {
    const permission = await authService.getPermission(this.getMethod())

    if (permission === PermissionState.DENIED) {
      throw new PermissionNotGranted(
        "The signer has rejected the request due to insufficient permissions."
      )
    }

    return permission
  }

  protected async onReject(message: MessageEvent<RPCMessage>): Promise<void> {
    const response: RPCErrorResponse = {
      origin: message.origin,
      jsonrpc: message.data.jsonrpc,
      id: message.data.id,
      error: {
        code: 3001,
        message: "Action aborted",
      },
    }

    window.opener.postMessage(response, message.origin)
  }
}
