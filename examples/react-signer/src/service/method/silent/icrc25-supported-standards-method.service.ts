import { RPCMessage, RPCSuccessResponse } from "../../../type"
import { SilentMethodService } from "./silent-method.service"

class Icrc25SupportedStandardsMethodService extends SilentMethodService {
  public getMethod(): string {
    return "icrc25_supported_standards"
  }

  public async sendResponse(message: MessageEvent<RPCMessage>): Promise<void> {
    const response: RPCSuccessResponse = {
      origin: message.origin,
      jsonrpc: message.data.jsonrpc,
      id: message.data.id,
      result: {
        supportedStandards: [
          {
            name: "ICRC-25",
            url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-25/ICRC-25.md",
          },
          {
            name: "ICRC-27",
            url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-27/ICRC-27.md",
          },
          {
            name: "ICRC-28",
            url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-28/ICRC-28.md",
          },
          {
            name: "ICRC-29",
            url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-29/ICRC-29.md",
          },
          {
            name: "ICRC-34",
            url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-34/ICRC-34.md",
          },
          {
            name: "ICRC-49",
            url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-49/ICRC-49.md",
          },
        ],
      },
    }

    window.opener.postMessage(response, message.origin)
  }
}

export const icrc25SupportedStandardsMethodService = new Icrc25SupportedStandardsMethodService()
