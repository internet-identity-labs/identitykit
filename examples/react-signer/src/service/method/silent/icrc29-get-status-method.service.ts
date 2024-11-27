import { RPCMessage, RPCSuccessResponse } from "../../../type"
import { SilentMethodService } from "./silent-method.service"

class Icrc29GetStatusMethodService extends SilentMethodService {
  private establishedOrigin?: string
  private establishedSource?: MessageEventSource | null

  public getMethod(): string {
    return "icrc29_status"
  }

  public async sendResponse(message: MessageEvent<RPCMessage>): Promise<void> {
    if (!this.establishedOrigin || !this.establishedSource) {
      this.establishedOrigin = message.origin
      this.establishedSource = message.source
    } else if (
      this.establishedOrigin !== message.origin &&
      this.establishedSource !== message.source
    ) {
      return
    }

    const response: RPCSuccessResponse = {
      origin: message.origin,
      jsonrpc: message.data.jsonrpc,
      id: message.data.id,
      result: "ready",
    }

    // TODO only for new window we use window opener, should respond according to transport
    window.opener.postMessage(response, message.origin)
  }
}

export const icrc29GetStatusMethodService = new Icrc29GetStatusMethodService()
