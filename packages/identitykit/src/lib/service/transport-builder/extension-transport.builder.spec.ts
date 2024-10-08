import { getExtensionTransportBuilder } from "./extension-transport.builder"
import { PlugTransport } from "@slide-computer/signer-transport-plug"
import { TransportBuilderRequest } from "./transport.builder"

describe("getExtensionTransportBuilder", () => {
  it("should return an instance of PlugTransport", async () => {
    const transport = await getExtensionTransportBuilder({ id: "Plug" } as TransportBuilderRequest)
    expect(transport).toBeInstanceOf(PlugTransport)
  })
})
