import { Agent as DfinityAgent, HttpAgent, Identity } from "@dfinity/agent"
import { Signer } from "@slide-computer/signer"
import { SignerAgent } from "@slide-computer/signer-agent"
import { PartialIdentity } from "@dfinity/identity"
import { Principal } from "@dfinity/principal"
import { Delegation } from "@dfinity/identity"

export type AgentOptions = {
  delegation?: Delegation
  signerAgent: SignerAgent<Signer>
  agent?: HttpAgent
  identity?: Identity | PartialIdentity
}

export class Agent implements DfinityAgent {
  private constructor(
    private signerAgentStrategy: DfinityAgent,
    private agentStrategy: DfinityAgent,
    private delegation?: Delegation
  ) {}

  static async create({ delegation, signerAgent, agent, identity }: AgentOptions) {
    const httpAgent = agent ?? (await HttpAgent.create({ identity, host: "https://icp-api.io/" }))

    return new Agent(signerAgent, httpAgent, delegation)
  }

  public async call(...params: Parameters<DfinityAgent["call"]>): ReturnType<DfinityAgent["call"]> {
    const strategy = this.delegation?.targets?.includes(Principal.from(params[0]))
      ? this.agentStrategy
      : this.signerAgentStrategy

    return strategy.call(...params)
  }

  public async query(
    ...params: Parameters<DfinityAgent["query"]>
  ): ReturnType<DfinityAgent["query"]> {
    const strategy = this.delegation?.targets?.includes(Principal.from(params[0]))
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
    const strategy = this.delegation?.targets?.includes(Principal.from(params[0]))
      ? this.agentStrategy
      : this.signerAgentStrategy
    return strategy.readState(...params)
  }
}
