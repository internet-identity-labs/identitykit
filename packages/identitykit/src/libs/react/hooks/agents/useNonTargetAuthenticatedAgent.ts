import { HttpAgent, Agent } from "@dfinity/agent"
import { useAsyncMemo } from "use-async-memo"

import { IdentityKitDelegationType } from "../../../../lib"
import { IdentityKitAuthType } from "../../../../lib/identity-kit"
import { useIdentityKit } from "../../context"
import { ICP_API_HOST } from "../../../../lib/constants"

export function useNonTargetAuthenticatedAgent(params?: {
  createAgent?: (() => Agent) | (() => Promise<Agent>)
  createAgentOptions?: Omit<Parameters<typeof HttpAgent.create>[0], "identity">
}) {
  const { createAgent, createAgentOptions = {} } = params ?? {}
  const { delegationType, identity, agent, authType } = useIdentityKit()

  // Agent should be used for a different canister in the ecosystem (i.e. icrc2_approve).
  // It will be identitykit agent when authType is ACCOUNTS or delegation is ACCOUNT,
  // otherwise dfinity HttpAgent with identity from identitykit
  const authenticatedNonTargetAgent = useAsyncMemo(async () => {
    if (
      authType === IdentityKitAuthType.ACCOUNTS ||
      delegationType === IdentityKitDelegationType.ACCOUNT
    ) {
      return agent
    } else if (identity) {
      if (createAgent) return await createAgent()
      return await HttpAgent.create({ identity, host: ICP_API_HOST, ...createAgentOptions })
    }
    return undefined
  }, [identity, delegationType, authType, agent, createAgent, createAgentOptions])

  return authenticatedNonTargetAgent
}
