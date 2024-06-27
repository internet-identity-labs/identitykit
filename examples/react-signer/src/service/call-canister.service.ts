import {
  Actor,
  ActorMethod,
  ActorSubclass,
  Agent,
  CallCanisterActorMethodMapped,
  Cbor,
} from "@nfid/agent"
import { DelegationIdentity } from "@dfinity/identity"
import { interfaceFactoryService } from "./interface-factory.service"
import { GenericError } from "./exception-handler.service"

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
  content: unknown[]
}

class CallCanisterService {
  public async call(request: CallCanisterRequest): Promise<CallCanisterResponse> {
    try {
      const interfaceFactory = await interfaceFactoryService.getInterfaceFactory(
        request.canisterId,
        request.agent
      )
      const actor = Actor.createCallCanisterActor(interfaceFactory, {
        agent: request.agent,
        canisterId: request.canisterId,
      }) as ActorSubclass<CallCanisterActorMethodMapped<Record<string, ActorMethod>>>
      const response = (await this.evaluateMethod(
        actor,
        request.calledMethodName,
        Buffer.from(request.parameters, "base64")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      )) as any

      const certificate: string = Buffer.from(response.meta.certificate).toString("base64")

      const cborContentMap = Cbor.encode(response.meta.contentMap)

      const contentMap: string = Buffer.from(cborContentMap).toString("base64")
      const content = response.result

      return {
        certificate,
        contentMap,
        content,
      }
    } catch (error) {
      throw new GenericError("The call cannot be executed")
    }
  }

  private async evaluateMethod(
    actor: ActorSubclass,
    methodName: string,
    parameters: ArrayBuffer
  ): Promise<unknown> {
    if (parameters === undefined) {
      return actor[methodName]()
    }
    return actor[methodName](parameters)
  }
}

export const callCanisterService = new CallCanisterService()
