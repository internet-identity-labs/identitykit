import { DelegationChain, DelegationIdentity, Ed25519KeyIdentity } from "@dfinity/identity"
import { JsonnableEd25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519.js"
import { callCanisterService, CallCanisterRequest } from "./call-canister.service"
import { Agent, HttpAgent, Identity } from "@dfinity/agent"
import { IDL } from "@dfinity/candid"

const IC_HOSTNAME = "https://ic0.app"
const HOUR = 3_600_000
const PUBLIC_IDENTITY: JsonnableEd25519KeyIdentity = [
  "302a300506032b6570032100ab6e2632ad83ae575430bc42f0f1627a5162f83a616941832eb318794187a0e7",
  "9871b91c474f2cc97fe25e134ab91310f57ba34c10c1e76e3d7dd5c47c41b77a",
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
    const agent: Agent = HttpAgent.createSync({
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
    expect(response.certificate).toMatch(/^2dn3o2pkZWxlZ2F0aW9uomtj/)
  }, 10000)
})
