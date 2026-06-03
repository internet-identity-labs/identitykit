import { jest } from "@jest/globals"
import { render, screen } from "@testing-library/react"

jest.unstable_mockModule(new URL("./item.tsx", import.meta.url).pathname, () => ({
  Item: jest.fn(({ children }) => <div data-testid="item">{children}</div>),
}))

const { AddressItem } = await import("./address-item")
const { Provider } = await import("../../../../context-providers")

describe.skip("AddressItem", () => {
  const value = "0x1234567890abcdef1234567890abcdef12345678"

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders the address with masked middle characters", () => {
    render(
      <Provider>
        <AddressItem value={value} />
      </Provider>
    )

    const addressElement = screen.getByText("0x123...45678")
    expect(addressElement).toBeInTheDocument()
  })
})
