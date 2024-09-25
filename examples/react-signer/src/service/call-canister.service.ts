import { Agent, blsVerify, CallRequest, Cbor, UpdateCallRejectedError } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import { DelegationIdentity } from "@dfinity/identity"
import { GenericError } from "./exception-handler.service"
import { defaultStrategy, pollForResponse } from "@dfinity/agent/lib/cjs/polling"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

export interface CallCanisterRequest {
  delegation: DelegationIdentity
  canisterId: string
  calledMethodName: string
  parameters: string
  agent: Agent
}

export interface CallCanisterResponse {
  contentMap: string
  certificate: string
}

class CallCanisterService {
  public async call(request: CallCanisterRequest): Promise<CallCanisterResponse> {
    try {
      const response = await this.poll(
        request.canisterId,
        request.calledMethodName,
        request.agent,
        Buffer.from(request.parameters, "base64")
      )
      const certificate: string = Buffer.from(response.certificate).toString("base64")
      const cborContentMap = Cbor.encode(response.contentMap)
      const contentMap: string = Buffer.from(cborContentMap).toString("base64")

      return {
        certificate,
        contentMap,
      }
    } catch (error) {
      console.error("The canister call cannot be executed:", error)

      if (error instanceof Error) {
        throw new GenericError(`The canister call cannot be executed: ${error.message}`)
      }

      throw new GenericError("The canister call cannot be executed")
    }
  }

  private async poll(
    canisterId: string,
    methodName: string,
    agent: Agent,
    arg: ArrayBuffer
  ): Promise<{ certificate: Uint8Array; contentMap: CallRequest | undefined }> {
    const canister = Principal.from(canisterId)
    const { requestId, response, requestDetails } = await agent.call(canister, {
      methodName,
      arg,
      effectiveCanisterId: canister,
    })

    if (!response.ok) {
      throw new UpdateCallRejectedError(canister, methodName, requestId, response)
    }

    const pollStrategy = defaultStrategy()
    const { certificate } = await pollForResponse(
      agent,
      canister,
      requestId,
      pollStrategy,
      undefined,
      blsVerify
    )

    return {
      contentMap: requestDetails,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      certificate: new Uint8Array(Cbor.encode((certificate as any).cert)),
    }
  }
}

export const callCanisterService = new CallCanisterService()
