import { Transport } from "@slide-computer/signer"
import { TransportType } from "../../types"
import { getPopupTransportBuilder } from "./popup-transport.builder"
import { getIframeTransportBuilder } from "./iframe-transport.builder"
import { getExtensionTransportBuilder } from "./extension-transport.builder"
import { TransportBuilder, TransportBuilderRequest } from "./transport.builder"

jest.mock("./popup-transport.builder")
jest.mock("./iframe-transport.builder")
jest.mock("./extension-transport.builder")

describe("TransportBuilder", () => {
  const mockTransport: Transport = {} as Transport

  beforeEach(() => {
    ;(getPopupTransportBuilder as jest.Mock).mockReturnValue(mockTransport)
    ;(getIframeTransportBuilder as jest.Mock).mockReturnValue(mockTransport)
    ;(getExtensionTransportBuilder as jest.Mock).mockReturnValue(mockTransport)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should build a POPUP transport", () => {
    const request: TransportBuilderRequest = {
      transportType: TransportType.POPUP,
      url: "https://example.com",
    }

    const result = TransportBuilder.build(request)

    expect(getPopupTransportBuilder).toHaveBeenCalledWith(request)
    expect(result).toBe(mockTransport)
  })

  it("should build an IFRAME transport", () => {
    const request: TransportBuilderRequest = {
      transportType: TransportType.IFRAME,
      url: "https://example.com",
    }

    const result = TransportBuilder.build(request)

    expect(getIframeTransportBuilder).toHaveBeenCalledWith(request)
    expect(result).toBe(mockTransport)
  })

  it("should build an EXTENSION transport", () => {
    const request: TransportBuilderRequest = {
      transportType: TransportType.EXTENSION,
      url: "https://example.com",
    }

    const result = TransportBuilder.build(request)

    expect(getExtensionTransportBuilder).toHaveBeenCalledWith(request)
    expect(result).toBe(mockTransport)
  })
})
