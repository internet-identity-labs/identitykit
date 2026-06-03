import {
  Agent,
  blsVerify,
  CallRequest,
  Cbor,
  Certificate,
  defaultStrategy,
  LookupResult,
  lookupResultToBuffer,
  pollForResponse,
  v4ResponseBody,
  v2ResponseBody,
  isV4ResponseBody,
} from "@icp-sdk/core/agent"
import { uint8FromBufLike } from "@icp-sdk/core/candid"
import { DelegationIdentity } from "@icp-sdk/core/identity"
import { Principal } from "@icp-sdk/core/principal"
import { GenericError } from "./exception-handler.service"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

// Local shim: UpdateCallRejectedError removed from @icp-sdk/core
class UpdateCallRejectedError extends Error {
  constructor(rejectMessage: string) {
    super(rejectMessage)
    this.name = "UpdateCallRejectedError"
  }
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
        new Uint8Array(Buffer.from(request.parameters, "base64"))
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
    arg: Uint8Array
  ): Promise<{ certificate: Uint8Array; contentMap: CallRequest | undefined }> {
    const cid = Principal.from(canisterId)

    if (agent.rootKey == null) throw new Error("Agent root key not initialized before making call")

    const { requestId, response, requestDetails } = await agent.call(cid, {
      methodName,
      arg,
      effectiveCanisterId: cid,
    })

    let certificate: Certificate | undefined
    let rawCertificate: Uint8Array | undefined

    if (response.body && isV4ResponseBody(response.body)) {
      const cert = (response.body as v4ResponseBody).certificate
      rawCertificate = uint8FromBufLike(cert)
      certificate = await Certificate.create({
        certificate: rawCertificate,
        rootKey: agent.rootKey,
        principal: { canisterId: Principal.from(canisterId) },
        blsVerify,
      })
      const path = [new TextEncoder().encode("request_status"), requestId]

      const statusBuffer = lookupResultToBuffer(
        certificate.lookup_path([...path, "status"]) as LookupResult
      )
      if (!statusBuffer) {
        throw new Error("Status buffer not found")
      }
      const status = new TextDecoder().decode(statusBuffer)

      switch (status) {
        case "replied":
          break
        case "rejected": {
          const rejectMessageBuffer = lookupResultToBuffer(
            certificate.lookup_path([...path, "reject_message"]) as LookupResult
          )
          const rejectMessage = rejectMessageBuffer
            ? new TextDecoder().decode(rejectMessageBuffer)
            : "Unknown rejection"

          throw new UpdateCallRejectedError(rejectMessage)
        }
      }
    } else if (response.body && "reject_message" in response.body) {
      const { reject_message } = response.body as v2ResponseBody
      throw new UpdateCallRejectedError(reject_message)
    }

    // Fall back to polling if we receive an Accepted response code
    if (response.status === 202) {
      const pollResponse = await pollForResponse(agent, cid, requestId, {
        strategy: defaultStrategy(),
      })
      rawCertificate = pollResponse.rawCertificate
    }

    if (!rawCertificate) {
      throw new Error("No certificate in response")
    }

    return {
      contentMap: requestDetails,
      certificate: rawCertificate,
    }
  }
}

export const callCanisterService = new CallCanisterService()
