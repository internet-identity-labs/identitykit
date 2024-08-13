// @ts-nocheck
import { render } from "@testing-library/react"
import { MenuItem } from "@headlessui/react"
import { Item } from "./item"

jest.mock("@headlessui/react", () => ({
  MenuItem: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
}))

describe("Item Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Item>Test</Item>)
    expect(container).toBeInTheDocument()
  })

  it("renders children correctly", () => {
    const { getByText } = render(<Item>Test Child</Item>)
    expect(getByText("Test Child")).toBeInTheDocument()
  })

  it("passes props to MenuItem correctly", () => {
    const dataTestId = "item"
    render(<Item data-testid={dataTestId}>Test</Item>)
    expect(MenuItem).toHaveBeenCalledWith(
      expect.objectContaining({
        "data-testid": dataTestId,
        children: "Test",
      }),
      {}
    )
  })
})
