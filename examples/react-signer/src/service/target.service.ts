import { Agent, compare, HttpAgent, lookup_path } from "@dfinity/agent"
import { actorService } from "./actor.service"
import { GenericError } from "./exception-handler.service"
import {
  type _SERVICE as ConsentMessageCanister,
  icrc28_trusted_origins_response,
} from "../idl/consent"
import { idlFactory as ConsentMessageCanisterIDL } from "../idl/consent_idl"
import crypto from "crypto"
import { verifyCertification } from "./util/cert-verification"
import { Principal } from "@dfinity/principal"
import { getLookupResultValue } from "./util/cert-verification/utils"

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
      const response = await actor.icrc28_trusted_origins()
      if (!response.trusted_origins.includes(origin)) {
        throw new GenericError(
          `The target canister ${canisterId} has no the trusted origin: ${origin}`
        )
      }
      await this.verifyCertifiedResponse(response, "origins", canisterId)
    })

    await Promise.all(promises)
  },

  async verifyCertifiedResponse(
    certifiedResponse: icrc28_trusted_origins_response,
    key: string,
    canisterId: string
  ) {
    const agent = new HttpAgent({ host: IC_HOSTNAME })
    const tree = await verifyCertification({
      canisterId: Principal.fromText(canisterId),
      encodedCertificate: new Uint8Array(certifiedResponse.certificate).buffer,
      encodedTree: new Uint8Array(certifiedResponse.witness).buffer,
      rootKey: agent.rootKey,
      maxCertificateTimeOffsetMs: 500000,
    })
    const treeHash = lookup_path([key], tree)
    const value = getLookupResultValue(treeHash)

    if (value) {
      const newOwnedString = certifiedResponse.trusted_origins.join("")
      const sha256Result = crypto.createHash("sha256").update(newOwnedString).digest()
      const byteArray = new Uint8Array(sha256Result)
      if (!this.equal(byteArray, value)) {
        throw new Error("Response hash does not match")
      }
    } else {
      throw new Error("Response not found in tree")
    }
  },

  equal(a: ArrayBuffer, b: ArrayBuffer): boolean {
    return compare(new Uint8Array(a), new Uint8Array(b)) === 0
  },
}
