import { jest } from "@jest/globals"
import type { Transport } from "@icp-sdk/signer"
import { TransportType } from "../../types"

jest.unstable_mockModule(
  new URL("./new-tab-transport.builder.ts", import.meta.url).pathname,
  () => ({
    getPopupTransportBuilder: jest.fn(),
  })
)

const { getPopupTransportBuilder } = await import("./new-tab-transport.builder")
const { TransportBuilder } = await import("./transport.builder")

describe("TransportBuilder", () => {
  const mockTransport: Transport = {} as Transport

  beforeEach(() => {
    ;(getPopupTransportBuilder as jest.Mock).mockReturnValue(mockTransport)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should build a NEW_TAB transport", async () => {
    const request = {
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
