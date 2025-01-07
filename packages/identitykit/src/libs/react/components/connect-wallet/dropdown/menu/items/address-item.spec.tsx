import { render, screen } from "@testing-library/react"
import { AddressItem } from "./address-item"
import { Provider } from "../../../../context-providers"

jest.mock("./item", () => ({
  Item: jest.fn(({ children }) => <div data-testid="item">{children}</div>),
}))

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
