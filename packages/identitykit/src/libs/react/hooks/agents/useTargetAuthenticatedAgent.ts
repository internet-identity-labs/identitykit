import { HttpAgent, ActorConfig, Agent } from "@dfinity/agent"
import { useAsyncMemo } from "use-async-memo"
import { IDL } from "@dfinity/candid"

import { IdentityKitAuthType } from "../../../../lib/identity-kit"
import { useIdentityKit } from "../../context"
import { ICP_API_HOST } from "../../../../lib/constants"

export function useTargetAuthenticatedAgent({
  createAgent,
  createAgentOptions = {},
}: {
  idlFactory: IDL.InterfaceFactory
  actorConfig: Omit<ActorConfig, "agent">
  createAgent?: (() => Agent) | (() => Promise<Agent>)
  createAgentOptions?: Omit<Parameters<typeof HttpAgent.create>[0], "identity">
}) {
  const { identity, agent, authType } = useIdentityKit()

  // Agent should be used for your target canisters
  // It will be identitykit agent when authType is ACCOUNTS,
  // otherwise dfinity HttpAgent with identity from identitykit
  const authenticatedTargetAgent = useAsyncMemo(async () => {
    if (authType === IdentityKitAuthType.ACCOUNTS) {
      return agent
    } else if (identity) {
      if (createAgent) return await createAgent()
      return await HttpAgent.create({ identity, host: ICP_API_HOST, ...createAgentOptions })
    }
    return undefined
  }, [identity, authType, agent])

  return authenticatedTargetAgent
}
