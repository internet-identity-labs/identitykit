import { TransportBuilderRequest } from "./transport.builder"
import { PostMessageTransport } from "@slide-computer/signer-web"
import { openPopup } from "../../../libs/react/utils"
import { getPopupTransportBuilder } from "./new-tab-transport.builder"
import { TransportType } from "../../types"

jest.mock("@slide-computer/signer-web", () => ({
  PostMessageTransport: jest.fn(),
}))

jest.mock("../../../libs/react/utils", () => ({
  openPopup: jest.fn(),
}))

describe("getPopupTransportBuilder", () => {
  const mockUrl = "http://example.com"

  const request: TransportBuilderRequest = {
    transportType: TransportType.NEW_TAB,
    url: mockUrl,
  }

  it("should return an instance of PostMessageTransport", () => {
    const transport = getPopupTransportBuilder(request)
    expect(transport).toBeInstanceOf(PostMessageTransport)
  })

  it("should not call openPopup with the correct parameters", () => {
    getPopupTransportBuilder(request)
    expect(openPopup).not.toHaveBeenCalledWith(mockUrl)
  })

  it("should pass openWindow function to PostMessageTransport", () => {
    getPopupTransportBuilder(request)
    expect(PostMessageTransport).toHaveBeenCalledWith({
      openWindow: expect.any(Function),
    })

    const openWindowFn = (PostMessageTransport as jest.Mock).mock.calls[0][0].openWindow
    openWindowFn()
    expect(openPopup).toHaveBeenCalledWith(mockUrl)
  })
})
