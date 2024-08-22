import { Agent, HttpAgent } from "@dfinity/agent"
import { actorService } from "./actor.service"
import { GenericError } from "./exception-handler.service"
import { type _SERVICE as ConsentMessageCanister } from "../idl/consent"
import { idlFactory as ConsentMessageCanisterIDL } from "../idl/consent_idl"
import { localStorageTTL } from "./local-strage-ttl"

const IC_HOSTNAME = "https://ic0.app"

export const targetService = {
  async validateTargets(targets: string[], origin: string) {
    const agent: Agent = HttpAgent.createSync({ host: IC_HOSTNAME })
    const promises = targets.map(async (canisterId) => {
      const actor = actorService.getActor<ConsentMessageCanister>(
        canisterId,
        ConsentMessageCanisterIDL,
        agent
      )
      const cacheKey = `trusted_origins_${canisterId}`
      const cache = localStorageTTL.getItem(cacheKey)
      let response
      if (cache !== null) {
        response = cache
      } else {
        response = await actor.icrc28_trusted_origins()
        localStorageTTL.setItem(cacheKey, response, 24)
      }
      if (!response.trusted_origins.includes(origin)) {
        throw new GenericError(
          `The target canister ${canisterId} has no the trusted origin: ${origin}`
        )
      }
    })

    await Promise.all(promises)
  },
}
