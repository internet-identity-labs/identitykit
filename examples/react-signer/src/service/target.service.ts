import { IDL } from "@dfinity/candid"
import { ActorMethod, Agent, HttpAgent } from "@dfinity/agent"
import { actorService } from "./actor.service"
import { GenericError } from "./exception-handler.service"

interface Target {
  get_trusted_origins: ActorMethod<[], Array<string>>
}

const host = "https://ic0.app"
const idl: IDL.InterfaceFactory = ({ IDL }) =>
  IDL.Service({
    get_trusted_origins: IDL.Func([], [IDL.Vec(IDL.Text)], []),
  })

export const targetService = {
  async validateTargets(targets: string[], origin: string) {
    const agent: Agent = new HttpAgent({ host })
    const promises = targets.map(async (canisterId) => {
      const actor = actorService.getActor<Target>(canisterId, idl, agent)
      const origins = await actor.get_trusted_origins()
      if (!origins.includes(origin)) {
        throw new GenericError(
          `The target canister ${canisterId} has no the trusted origin: ${origin}`
        )
      }
    })

    await Promise.all(promises)
  },
}
