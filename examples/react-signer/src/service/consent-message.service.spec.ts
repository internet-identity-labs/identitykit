import { Agent, HttpAgent } from "@nfid/agent"
import { consentMessageService } from "./consent-message.service"
import { IDL } from "@dfinity/candid"

const IC_HOSTNAME = "https://ic0.app"

describe("Consent Message Service", function () {
  it("should throw generic error", async function () {
    const canisterId = "rdmx6-jaaaa-aaaaa-aaadq-cai"
    const methodName = "greet"
    const argument = Buffer.from(IDL.encode([IDL.Text], ["me"])).toString("base64")
    const agent: Agent = new HttpAgent({
      host: IC_HOSTNAME,
    })
    const message = await consentMessageService.getConsentMessage(
      canisterId,
      methodName,
      argument,
      agent
    )
    expect(message).toBeUndefined()
  })

  it("should return consent message", async function () {
    const methodName = "greet"
    const canisterId = "vg4p4-3yaaa-aaaad-aad6q-cai"
    const argument = Buffer.from(IDL.encode([IDL.Text], ["me"])).toString("base64")
    const agent: Agent = new HttpAgent({
      host: IC_HOSTNAME,
    })
    const message = await consentMessageService.getConsentMessage(
      canisterId,
      methodName,
      argument,
      agent
    )

    expect(message).toBe("Produce the following greeting text:\n> Hello, me!")
  })
})
