import React from "react"
import { render, fireEvent } from "@testing-library/react"
import { LogoutItem } from "./logout-item"

jest.mock("../../../icons", () => ({
  LogoutIcon: () => <svg data-testid="logout-icon" />,
}))

jest.mock("./item", () => ({
  Item: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock("./item-inner", () => ({
  ItemInner: ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <div onClick={onClick}>{children}</div>
  ),
}))

describe("LogoutItem", () => {
  it("renders without crashing", () => {
    const { getByText, getByTestId } = render(<LogoutItem onClick={() => {}} />)

    expect(getByText("Disconnect")).toBeInTheDocument()

    expect(getByTestId("logout-icon")).toBeInTheDocument()
  })

  it("calls onClick when ItemInner is clicked", () => {
    const handleClick = jest.fn()
    const { getByText } = render(<LogoutItem onClick={handleClick} />)

    fireEvent.click(getByText("Disconnect"))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
