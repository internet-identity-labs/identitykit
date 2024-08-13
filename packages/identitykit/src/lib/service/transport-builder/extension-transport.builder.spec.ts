import { getExtensionTransportBuilder } from "./extension-transport.builder"

describe("getExtensionTransportBuilder", () => {
  it("should throw an error when called", () => {
    expect(() => {
      getExtensionTransportBuilder()
    }).toThrow(new Error("getExtensionTransport function not implemented."))
  })
})
