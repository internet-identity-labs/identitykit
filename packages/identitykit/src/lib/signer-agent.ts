import { Principal } from "@dfinity/principal"
import { Signer } from "@slide-computer/signer"
import { SignerAgent as SlideComputerSignerAgent } from "@slide-computer/signer-agent"
import { type SignerAgentOptions as SlideComputerSignerAgentOptions } from "@slide-computer/signer-agent"
import { type SubmitResponse } from "@dfinity/agent"

export type SignerAgentOptions = Omit<SlideComputerSignerAgentOptions, "signer"> & {
  signer: Pick<Signer, "permissions" | "callCanister" | "requestPermissions">
}
export class SignerAgent extends SlideComputerSignerAgent {
  private readonly signer: Pick<Signer, "callCanister" | "permissions" | "requestPermissions">

  constructor(options: SignerAgentOptions) {
    super(options)
    this.signer = options.signer
  }

  async call(
    canisterId: Principal | string,
    options: {
      methodName: string
      arg: ArrayBuffer
      effectiveCanisterId?: Principal | string
    }
  ): Promise<SubmitResponse> {
    const permissions = await this.signer.permissions()
    const permission = permissions.find((x) => x.scope.method === "icrc49_call_canister")
    if (!permission || permission.state === "ask_on_use" || permission.state === "denied") {
      await this.signer.requestPermissions([
        {
          method: "icrc49_call_canister",
        },
      ])
    }
    return super.call(canisterId, options)
  }
}
