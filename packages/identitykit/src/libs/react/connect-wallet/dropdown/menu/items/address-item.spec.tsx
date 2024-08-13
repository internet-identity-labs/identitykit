import { render, screen } from "@testing-library/react"
import { AddressItem } from "./address-item"

jest.mock("../../../../ui", () => ({
  CopyToClipboard: jest.fn(({ component }) => {
    const onClick = jest.fn()
    return component({ onClick })
  }),
}))

jest.mock("../../../icons", () => ({
  CopiedIcon: jest.fn(() => <div data-testid="copied-icon" />),
  CopyIcon: jest.fn(() => <div data-testid="copy-icon" />),
}))

jest.mock("./item", () => ({
  Item: jest.fn(({ children }) => <div data-testid="item">{children}</div>),
}))

jest.mock("./item-inner", () => ({
  ItemInner: jest.fn(({ onClick, children }) => (
    <div data-testid="item-inner" onClick={onClick}>
      {children}
    </div>
  )),
}))

describe("AddressItem", () => {
  const value = "0x1234567890abcdef1234567890abcdef12345678"
  const onCopied = jest.fn()
  const onCopiedTimeout = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders the address with masked middle characters", () => {
    render(<AddressItem value={value} onCopied={onCopied} onCopiedTimeout={onCopiedTimeout} />)

    const addressElement = screen.getByText("0x123...45678")
    expect(addressElement).toBeInTheDocument()
  })

  it("renders CopyIcon when copied is false", () => {
    render(
      <AddressItem
        value={value}
        onCopied={onCopied}
        onCopiedTimeout={onCopiedTimeout}
        copied={false}
      />
    )

    expect(screen.getByTestId("copy-icon")).toBeInTheDocument()
    expect(screen.queryByTestId("copied-icon")).not.toBeInTheDocument()
  })

  it("renders CopiedIcon when copied is true", () => {
    render(
      <AddressItem
        value={value}
        onCopied={onCopied}
        onCopiedTimeout={onCopiedTimeout}
        copied={true}
      />
    )

    expect(screen.getByTestId("copied-icon")).toBeInTheDocument()
    expect(screen.queryByTestId("copy-icon")).not.toBeInTheDocument()
  })
})
