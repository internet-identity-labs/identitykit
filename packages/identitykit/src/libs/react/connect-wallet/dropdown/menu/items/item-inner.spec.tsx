import { render } from "@testing-library/react"
import { ItemInner } from "./item-inner"

describe("ItemInner Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<ItemInner>Test</ItemInner>)
    expect(container).toBeInTheDocument()
  })

  it("applies default classes correctly", () => {
    const { container } = render(<ItemInner>Test</ItemInner>)
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
    const { container } = render(<ItemInner className={additionalClass}>Test</ItemInner>)
    const divElement = container.firstChild as HTMLDivElement
    expect(divElement).toHaveClass(additionalClass)
  })

  it("renders children correctly", () => {
    const { getByText } = render(<ItemInner>Test Child</ItemInner>)
    expect(getByText("Test Child")).toBeInTheDocument()
  })

  it("passes additional props to the div element", () => {
    const dataTestId = "item-inner"
    const { getByTestId } = render(<ItemInner data-testid={dataTestId}>Test</ItemInner>)
    expect(getByTestId(dataTestId)).toBeInTheDocument()
  })
})
