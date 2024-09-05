import { render, fireEvent } from "@testing-library/react"
import { DisconnectItem } from "./disconnect-item"

jest.mock("../../../icons", () => ({
  LogoutIcon: () => <svg data-testid="logout-icon" />,
}))

describe("LogoutItem", () => {
  it("renders without crashing", () => {
    const { getByText, getByTestId } = render(<DisconnectItem onClick={() => {}} />)

    expect(getByText("Disconnect")).toBeInTheDocument()

    expect(getByTestId("logout-icon")).toBeInTheDocument()
  })

  it("calls onClick when ItemInner is clicked", () => {
    const handleClick = jest.fn()
    const { getByText } = render(<DisconnectItem onClick={handleClick} />)

    fireEvent.click(getByText("Disconnect"))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
