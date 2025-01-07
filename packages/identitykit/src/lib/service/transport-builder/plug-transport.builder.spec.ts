import { PlugTransport } from "@slide-computer/signer-transport-plug"
import { getPlugTransportBuilder } from "./plug-transport.builder"

describe("getPlugTransportBuilder", () => {
  it("should return an instance of PlugTransport", async () => {
    const transport = await getPlugTransportBuilder()
    expect(transport).toBeInstanceOf(PlugTransport)
  })
})
