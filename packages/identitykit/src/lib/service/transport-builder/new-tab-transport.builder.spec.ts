import { jest } from "@jest/globals"

jest.unstable_mockModule("@slide-computer/signer-web", () => ({
  PostMessageTransport: jest.fn(),
}))

jest.unstable_mockModule(
  new URL("../../../libs/react/utils/index.ts", import.meta.url).pathname,
  () => ({
    url: "http://example.com",
  })
)

const { PostMessageTransport } = await import("@slide-computer/signer-web")
const { getPopupTransportBuilder } = await import("./new-tab-transport.builder")

describe("getPopupTransportBuilder", () => {
  const mockUrl = "http://example.com"

  const request = {
    url: mockUrl,
  }

  it("should return an instance of PostMessageTransport", async () => {
    const transport = await getPopupTransportBuilder(request)
    expect(transport).toBeInstanceOf(PostMessageTransport)
  })

  it("should pass url to PostMessageTransport", async () => {
    await getPopupTransportBuilder(request)
    expect(PostMessageTransport).toHaveBeenCalledWith({
      url: mockUrl,
      detectNonClickEstablishment: false,
      disconnectTimeout: 10_000,
    })
  })
})
