import { RPCMessage, RPCSuccessResponse } from "../../../type"
import { SilentMethodService } from "./silent-method.service"

class Icrc29GetStatusMethodService extends SilentMethodService {
  public getMethod(): string {
    return "icrc29_status"
  }

  public async sendResponse(message: MessageEvent<RPCMessage>): Promise<void> {
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
