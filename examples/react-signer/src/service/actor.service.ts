import { Actor, type ActorSubclass, type Agent } from "@icp-sdk/core/agent"
import { type IDL } from "@icp-sdk/core/candid"

class ActorService {
  public getActor<T>(
    canisterId: string,
    factory: IDL.InterfaceFactory,
    agent?: Agent
  ): ActorSubclass<T> {
    return Actor.createActor(factory, { canisterId, agent })
  }
}

export const actorService = new ActorService()
