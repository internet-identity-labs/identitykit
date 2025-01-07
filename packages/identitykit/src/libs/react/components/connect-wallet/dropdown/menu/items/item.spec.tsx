import { render } from "@testing-library/react"
import { Item } from "./item"

describe("ItemInner Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Item>Test</Item>)
    expect(container).toBeInTheDocument()
  })

  it("applies default classes correctly", () => {
    const { container } = render(<Item>Test</Item>)
    const divElement = container.firstChild as HTMLDivElement
    expect(divElement).toHaveClass(
      "ik-flex",
      "ik-justify-between",
      "ik-w-full",
      "ik-p-2.5",
      "ik-text-black",
      "dark:ik-text-white",
      "ik-cursor-pointer"
    )
  })

  it("applies additional className prop", () => {
    const additionalClass = "my-custom-class"
    const { container } = render(<Item className={additionalClass}>Test</Item>)
    const divElement = container.firstChild as HTMLDivElement
    expect(divElement).toHaveClass(additionalClass)
  })

  it("renders children correctly", () => {
    const { getByText } = render(<Item>Test Child</Item>)
    expect(getByText("Test Child")).toBeInTheDocument()
  })

  it("passes additional props to the div element", () => {
    const dataTestId = "item-inner"
    const { getByTestId } = render(<Item data-testid={dataTestId}>Test</Item>)
    expect(getByTestId(dataTestId)).toBeInTheDocument()
  })
})
