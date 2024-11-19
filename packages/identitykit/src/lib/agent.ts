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
    const strategy =
      this.delegation &&
      (!delegationTargets?.length ||
        delegationTargets?.find((t) => t.compareTo(Principal.from(params[0])) === "eq"))
        ? this.agentStrategy
        : this.signerAgentStrategy

    return strategy.call(...params)
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

  async createReadStateRequest?(): Promise<any> {
    return {
      body: {
        content: {
          ingress_expiry: undefined,
        },
      },
    }
  }
}
