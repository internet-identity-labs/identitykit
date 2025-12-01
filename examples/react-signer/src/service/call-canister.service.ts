import {
  Agent,
  blsVerify,
  CallRequest,
  Cbor,
  Certificate,
  lookupResultToBuffer,
  UpdateCallRejectedError,
  v2ResponseBody,
  v3ResponseBody,
} from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import { DelegationIdentity } from "@dfinity/identity"
import { GenericError } from "./exception-handler.service"
import { defaultStrategy, pollForResponse } from "@dfinity/agent/lib/cjs/polling"
import { bufFromBufLike } from "@dfinity/candid"
import { AgentError } from "@dfinity/agent/lib/cjs/errors"

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
        // @ts-expect-error - Buffer is compatible with ArrayBuffer in runtime
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
    const cid = Principal.from(canisterId)

    if (agent.rootKey == null)
      throw new AgentError("Agent root key not initialized before making call")

    const { requestId, response, requestDetails } = await agent.call(cid, {
      methodName,
      arg,
      effectiveCanisterId: cid,
    })

    let certificate: Certificate | undefined

    if (response.body && (response.body as v3ResponseBody).certificate) {
      const cert = (response.body as v3ResponseBody).certificate
      certificate = await Certificate.create({
        certificate: bufFromBufLike(cert),
        rootKey: agent.rootKey,
        canisterId: Principal.from(canisterId),
        blsVerify,
      })
      const path = [new TextEncoder().encode("request_status"), requestId]
      const status = new TextDecoder().decode(
        // @ts-expect-error - Uint8Array is compatible with ArrayBuffer in runtime
        lookupResultToBuffer(certificate.lookup([...path, "status"]))
      )

      switch (status) {
        case "replied":
          break
        case "rejected": {
          // Find rejection details in the certificate
          const rejectCode = new Uint8Array(
            // @ts-expect-error - Uint8Array is compatible with ArrayBuffer in runtime
            lookupResultToBuffer(certificate.lookup([...path, "reject_code"]))!
          )[0]
          const rejectMessage = new TextDecoder().decode(
            // @ts-expect-error - Uint8Array is compatible with ArrayBuffer in runtime
            lookupResultToBuffer(certificate.lookup([...path, "reject_message"]))!
          )
          // @ts-expect-error - Uint8Array is compatible with ArrayBuffer in runtime
          const error_code_buf = lookupResultToBuffer(certificate.lookup([...path, "error_code"]))
          const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : undefined
          throw new UpdateCallRejectedError(
            cid,
            methodName,
            requestId,
            response,
            rejectCode,
            rejectMessage,
            error_code
          )
        }
      }
    } else if (response.body && "reject_message" in response.body) {
      // handle v2 response errors by throwing an UpdateCallRejectedError object
      const { reject_code, reject_message, error_code } = response.body as v2ResponseBody
      throw new UpdateCallRejectedError(
        cid,
        methodName,
        requestId,
        response,
        reject_code,
        reject_message,
        error_code
      )
    }

    // Fall back to polling if we receive an Accepted response code
    if (response.status === 202) {
      const pollStrategy = defaultStrategy()
      // Contains the certificate and the reply from the boundary node
      const response = await pollForResponse(
        agent,
        cid,
        requestId,
        pollStrategy,
        undefined,
        blsVerify
      )
      certificate = response.certificate
    }

    return {
      contentMap: requestDetails,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      certificate: new Uint8Array(Cbor.encode((certificate as any).cert)),
    }
  }
}

export const callCanisterService = new CallCanisterService()
