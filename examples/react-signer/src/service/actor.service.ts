import { Actor, type ActorSubclass, type Agent } from "@dfinity/agent"
import { type InterfaceFactory } from "@dfinity/candid/lib/cjs/idl"

class ActorService {
  public getActor<T>(
    canisterId: string,
    factory: InterfaceFactory,
    agent?: Agent
  ): ActorSubclass<T> {
    return Actor.createActor(factory, { canisterId, agent })
  }
}

export const actorService = new ActorService()
