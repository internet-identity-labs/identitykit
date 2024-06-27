import { RPCMessage, RPCErrorResponse } from "../../../type"
import { authService } from "../../auth.service"
import {
  GenericError,
  NotSupportedError,
  exceptionHandlerService,
} from "../../exception-handler.service"
import { MethodService } from "../method.servcie"

export interface ComponentData {
  method: string
  origin: string
  onApprove: (data?: unknown) => Promise<void>
  onReject: () => Promise<void>
}

export abstract class InteractiveMethodService implements MethodService {
  public async invokeAndGetComponentData(
    message: MessageEvent<RPCMessage>
  ): Promise<ComponentData | undefined> {
    const authorized = await this.isAuthorized()

    if (!authorized) {
      throw new GenericError("Permission not granted")
    }

    const componentData = this.getСomponentData(message)
    if (!componentData) {
      throw new NotSupportedError()
    }

    return componentData
  }

  public abstract getMethod(): string
  public abstract onApprove(message: MessageEvent<RPCMessage>, data?: unknown): Promise<void>

  protected async isAuthorized(): Promise<boolean> {
    return await authService.hasPermission(this.getMethod())
  }

  public async getСomponentData(message: MessageEvent<RPCMessage>): Promise<ComponentData> {
    return {
      method: message.data.method,
      origin: message.origin,
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
