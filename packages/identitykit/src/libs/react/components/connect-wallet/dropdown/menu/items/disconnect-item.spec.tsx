import { jest } from "@jest/globals"
import { render, fireEvent } from "@testing-library/react"

jest.unstable_mockModule(new URL("../../../icons/index.ts", import.meta.url).pathname, () => ({
  LogoutIcon: () => <svg data-testid="logout-icon" />,
}))

const { DisconnectItem } = await import("./disconnect-item")

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
