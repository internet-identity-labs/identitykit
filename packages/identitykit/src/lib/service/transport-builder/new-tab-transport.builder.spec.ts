import { TransportBuilderRequest } from "./transport.builder"
import { PostMessageTransport } from "@slide-computer/signer-web"
import { getPopupTransportBuilder } from "./new-tab-transport.builder"
import { TransportType } from "../../types"

jest.mock("@slide-computer/signer-web", () => ({
  PostMessageTransport: jest.fn(),
}))

jest.mock("../../../libs/react/utils", () => ({
  url: "http://example.com",
}))

describe("getPopupTransportBuilder", () => {
  const mockUrl = "http://example.com"

  const request: TransportBuilderRequest = {
    transportType: TransportType.NEW_TAB,
    url: mockUrl,
  }

  it("should return an instance of PostMessageTransport", async () => {
    const transport = await getPopupTransportBuilder(request)
    expect(transport).toBeInstanceOf(PostMessageTransport)
  })

  it("should pass url to PostMessageTransport", async () => {
    await getPopupTransportBuilder(request)
    expect(PostMessageTransport).toHaveBeenCalledWith({
      url: "http://example.com",
      crypto: globalThis.crypto,
    })
  })
})
