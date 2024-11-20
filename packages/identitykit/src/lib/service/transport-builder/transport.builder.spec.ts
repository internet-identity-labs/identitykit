import { Transport } from "@slide-computer/signer"
import { TransportType } from "../../types"
import { getPopupTransportBuilder } from "./new-tab-transport.builder"
import { getExtensionTransportBuilder } from "./extension-transport.builder"
import { TransportBuilder, TransportBuilderRequest } from "./transport.builder"
import { getPlugTransportBuilder } from "./plug-transport.builder"

jest.mock("./new-tab-transport.builder")
jest.mock("./extension-transport.builder")

describe("TransportBuilder", () => {
  const mockTransport: Transport = {} as Transport

  beforeEach(() => {
    ;(getPopupTransportBuilder as jest.Mock).mockReturnValue(mockTransport)
    ;(getExtensionTransportBuilder as jest.Mock).mockReturnValue(mockTransport)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should build a NEW_TAB transport", async () => {
    const request: TransportBuilderRequest = {
      transportType: TransportType.NEW_TAB,
      url: "https://example.com",
    }

    const result = await TransportBuilder.build(request)

    expect(getPopupTransportBuilder).toHaveBeenCalledWith({
      url: "https://example.com",
      crypto: undefined,
      window: undefined,
    })
    expect(result).toBe(mockTransport)
  })

  it("should build a PLUG transport", async () => {
    const request: TransportBuilderRequest = {
      transportType: TransportType.PLUG,
      url: "https://example.com",
    }

    const result = await TransportBuilder.build(request)

    expect(getPlugTransportBuilder).toHaveBeenCalledWith({ id: undefined })
    expect(result).toBe(mockTransport)
  })
})
