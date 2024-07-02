import { DelegationChain, DelegationIdentity, Ed25519KeyIdentity } from "@dfinity/identity"
import { JsonnableEd25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519.js"
import { callCanisterService, CallCanisterRequest } from "./call-canister.service"
import { Agent, HttpAgent, Identity } from "@nfid/agent"
import { IDL } from "@dfinity/candid"

const IC_HOSTNAME = "https://ic0.app"
const HOUR = 3_600_000
const PUBLIC_IDENTITY: JsonnableEd25519KeyIdentity = [
  "302a300506032b65700321003b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
  "00000000000000000000000000000000000000000000000000000000000000003b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
]
const SESSION_IDENTITY: JsonnableEd25519KeyIdentity = [
  "302a300506032b65700321003008adc857dfcd0477a7aaa01a657ca6923ce76c07645704b1e872deb1253baa",
  "de33b3c3ed88942af13cb4fe4384f9e9126d8af5482dbc9ccd71208f250bdaed",
]

describe("Call Canister Service", function () {
  it("should call canister and return expected result", async function () {
    const identity = Ed25519KeyIdentity.fromParsedJson(PUBLIC_IDENTITY)
    const sessionKey = Ed25519KeyIdentity.fromParsedJson(SESSION_IDENTITY)
    const chain = await DelegationChain.create(
      identity,
      sessionKey.getPublicKey(),
      new Date(Date.now() + 44 * HOUR),
      {}
    )
    const delegation = DelegationIdentity.fromDelegation(sessionKey, chain)
    const agent: Agent = new HttpAgent({
      host: IC_HOSTNAME,
      identity: delegation as unknown as Identity,
    })
    const request: CallCanisterRequest = {
      delegation,
      canisterId: "do25a-dyaaa-aaaak-qifua-cai",
      calledMethodName: "greet",
      parameters: Buffer.from(IDL.encode([IDL.Text], ["me"])).toString("base64"),
      agent,
    }
    const response = await callCanisterService.call(request)

    expect(response.contentMap).toMatch(/^2dn3p2NhcmdKRElETAABcQJtZWtjYW5pc3Rlcl9/)
    expect(response.certificate).toMatch(/^2dn3o2R0cmVlgwGDAYIEWC/)
  }, 10000)
})
