import { HttpAgent, Actor } from "@dfinity/agent"
import { idlFactory } from "./idl/ledger"
import { DelegationType, SignerClient } from "./signer-client"

const LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai"

export class IdentityKit {
  constructor(public readonly signerClient: SignerClient) {}

  async getIcpBalance(): Promise<string> {
    const identity = this.signerClient.getIdentity()
    if (!identity) throw new Error("Not authenticated")

    const delegationType = await this.signerClient.getDelegationType()
    if (delegationType === DelegationType.ANONYMOUS) {
      throw new Error("Cannot get icp balance of anonymous delegation")
    }

    const agent = new HttpAgent()
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: LEDGER_CANISTER_ID,
    })

    return (await actor.account_balance({ account: identity.getPrincipal().toString() })) as string
  }
}
