import { RPCMessage } from "../type"

export class NotSupportedError extends Error {}
export class GenericError extends Error {}

class ExceptionHandlerService {
  public handle(error: unknown, message: MessageEvent<RPCMessage>) {
    console.error("ExceptionHandlerService", error)

    if (error instanceof NotSupportedError) {
      this.postErrorMessage(message, 2000, "Not supported")
    }

    if (error instanceof GenericError) {
      this.postErrorMessage(message, 1000, "Generic error", error.message)
    }
  }

  private postErrorMessage(
    message: MessageEvent<RPCMessage>,
    code: number,
    title: string,
    text?: string
  ) {
    window.opener.postMessage(
      {
        origin: message.data.origin,
        jsonrpc: message.data.jsonrpc,
        id: message.data.id,
        error: {
          code,
          message: title,
          text,
        },
      },
      message.origin
    )
  }
}

export const exceptionHandlerService = new ExceptionHandlerService()
