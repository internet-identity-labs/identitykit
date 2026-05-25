import { Agent as DfinityAgent, HttpAgent, Identity } from "@dfinity/agent"
import { Signer } from "@slide-computer/signer"
import { SignerAgent } from "@slide-computer/signer-agent"
import { PartialIdentity } from "@dfinity/identity"
import { Principal } from "@dfinity/principal"
import { Delegation } from "@dfinity/identity"

export type AgentOptions = {
  delegation?: Delegation
  signerAgent: SignerAgent<Signer>
  agent: HttpAgent
  identity?: Identity | PartialIdentity
}

export class Agent implements DfinityAgent {
  private constructor(
    private signerAgentStrategy: DfinityAgent,
    private agentStrategy: DfinityAgent,
    private delegation?: Delegation
  ) {}

  static async create({ delegation, signerAgent, agent }: AgentOptions) {
    return new Agent(signerAgent, agent, delegation)
  }

  public async call(...params: Parameters<DfinityAgent["call"]>): ReturnType<DfinityAgent["call"]> {
    const delegationTargets = this.delegation?.targets
    const useAgent =
      this.delegation &&
      (!delegationTargets?.length ||
        delegationTargets?.find((t) => t.compareTo(Principal.from(params[0])) === "eq"))
    const strategy = useAgent ? this.agentStrategy : this.signerAgentStrategy

    console.log("[IK-AGENT] call:", {
      canisterId: params[0]?.toString(),
      useDirectAgent: !!useAgent,
      hasDelegation: !!this.delegation,
      delegationTargets: delegationTargets?.map((t) => t.toText()),
    })

    try {
      const result = await strategy.call(...params)
      console.log("[IK-AGENT] call succeeded")
      return result
    } catch (e: any) {
      console.error("[IK-AGENT] call FAILED:", e.message, e)
      throw e
    }
  }

  public async query(
    ...params: Parameters<DfinityAgent["query"]>
  ): ReturnType<DfinityAgent["query"]> {
    const delegationTargets = this.delegation?.targets
    const strategy =
      this.delegation &&
      (!delegationTargets?.length ||
        delegationTargets?.find((t) => t.compareTo(Principal.from(params[0])) === "eq"))
        ? this.agentStrategy
        : this.signerAgentStrategy

    return strategy.query(...params)
  }

  get rootKey() {
    return this.agentStrategy.rootKey
  }

  async fetchRootKey(): ReturnType<DfinityAgent["fetchRootKey"]> {
    return this.agentStrategy.fetchRootKey()
  }

  async getPrincipal(): ReturnType<DfinityAgent["getPrincipal"]> {
    return this.agentStrategy.getPrincipal()
  }

  async status(): ReturnType<DfinityAgent["status"]> {
    return this.agentStrategy.status()
  }

  async readState(
    ...params: Parameters<DfinityAgent["readState"]>
  ): ReturnType<DfinityAgent["readState"]> {
    const delegationTargets = this.delegation?.targets
    const strategy =
      this.delegation &&
      (!delegationTargets?.length ||
        delegationTargets?.find((t) => t.compareTo(Principal.from(params[0])) === "eq"))
        ? this.agentStrategy
        : this.signerAgentStrategy

    return strategy.readState(...params)
  }

  async createReadStateRequest?(
    ...params: Parameters<NonNullable<DfinityAgent["createReadStateRequest"]>>
  ): ReturnType<NonNullable<DfinityAgent["createReadStateRequest"]>> {
    return this.agentStrategy.createReadStateRequest?.(...params)
  }
}
