import { getIframeTransportBuilder } from "./iframe-transport.builder"

describe("getIframeTransportBuilder", () => {
  it("should throw an error when called", () => {
    expect(() => {
      getIframeTransportBuilder()
    }).toThrow(new Error("getIframeTransport function not implemented."))
  })
})
