import { Principal } from "@dfinity/principal"
import { Signer } from "@slide-computer/signer"
import { SignerAgentError } from "@slide-computer/signer-agent"
import {
  type SignerAgentOptions as SlideComputerSignerAgentOptions,
  SignerAgent as SlideComputerSignerAgent,
} from "@slide-computer/signer-agent"
import {
  type SubmitResponse,
  Agent,
  ApiQueryResponse,
  Identity,
  QueryFields,
  ReadStateOptions,
  ReadStateResponse,
} from "@dfinity/agent"
import { JsonObject } from "@dfinity/candid"

export type SignerAgentOptions = Omit<SlideComputerSignerAgentOptions, "signer"> & {
  signer: Pick<Signer, "permissions" | "callCanister" | "requestPermissions">
}
export class SignerAgent implements Agent {
  static #isInternalConstructing: boolean = false

  private readonly signer: Pick<Signer, "callCanister" | "permissions" | "requestPermissions">
  private readonly agent: SlideComputerSignerAgent
  rootKey: null | ArrayBuffer = null

  constructor(options: SignerAgentOptions, agent: SlideComputerSignerAgent) {
    const throwError = !SignerAgent.#isInternalConstructing
    SignerAgent.#isInternalConstructing = false
    if (throwError) {
      throw new SignerAgentError("SignerAgent is not constructable")
    }
    this.signer = options.signer
    this.agent = agent
    this.rootKey = this.agent.rootKey
  }

  static async create(options: SignerAgentOptions) {
    SignerAgent.#isInternalConstructing = true
    var agent = await SlideComputerSignerAgent.create(options)
    return new SignerAgent(options, agent)
  }

  getPrincipal(): Promise<Principal> {
    return this.agent.getPrincipal()
  }
  createReadStateRequest?(_options: ReadStateOptions): Promise<any> {
    return this.agent.createReadStateRequest(_options)
  }
  readState(
    effectiveCanisterId: Principal | string,
    options: ReadStateOptions,
    identity?: Identity,
    request?: any
  ): Promise<ReadStateResponse> {
    return this.agent.readState(effectiveCanisterId, options, identity, request)
  }
  status(): Promise<JsonObject> {
    return this.agent.status()
  }

  async query(canisterId: Principal | string, options: QueryFields): Promise<ApiQueryResponse> {
    await this.hasPermission()
    return this.agent.query(canisterId, options)
  }

  fetchRootKey(): Promise<ArrayBuffer> {
    return this.agent.fetchRootKey()
  }

  async call(
    canisterId: Principal | string,
    options: {
      methodName: string
      arg: ArrayBuffer
      effectiveCanisterId?: Principal | string
    }
  ): Promise<SubmitResponse> {
    await this.hasPermission()
    return this.agent.call(canisterId, options)
  }

  private async hasPermission(): Promise<void> {
    const permissions = await this.signer.permissions()
    const permission = permissions.find((x) => x.scope.method === "icrc49_call_canister")
    if (!permission || permission.state === "ask_on_use" || permission.state === "denied") {
      await this.signer.requestPermissions([
        {
          method: "icrc49_call_canister",
        },
      ])

      if (!permission || permission.state === "ask_on_use") {
        await this.hasPermission()
        return
      }

      if (permission.state === "denied") {
        throw Error("Has no permission to do the canister call")
      }
    }
  }
}
