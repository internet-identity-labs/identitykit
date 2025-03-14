import { Transport } from "@slide-computer/signer"
import { TransportType } from "../../types"
import { getPopupTransportBuilder } from "./new-tab-transport.builder"
import { TransportBuilder, TransportBuilderRequest } from "./transport.builder"

jest.mock("./new-tab-transport.builder")

describe("TransportBuilder", () => {
  const mockTransport: Transport = {} as Transport

  beforeEach(() => {
    ;(getPopupTransportBuilder as jest.Mock).mockReturnValue(mockTransport)
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
})
