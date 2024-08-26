import { getExtensionTransportBuilder } from "./extension-transport.builder"
import { PlugTransport } from "@slide-computer/signer-transport-plug"

describe("getExtensionTransportBuilder", () => {
  it("should return an instance of PlugTransport", () => {
    const transport = getExtensionTransportBuilder()
    expect(transport).toBeInstanceOf(PlugTransport)
  })
})
