import { render, screen } from "@testing-library/react"
import { Menu } from "./menu"

describe("Menu Component", () => {
  it("should render without crashing", () => {
    render(<Menu>Menu Content</Menu>)
    expect(screen.getByText("Menu Content")).toBeInTheDocument()
  })

  it("should apply the given className", () => {
    render(<Menu className="custom-class">Menu Content</Menu>)
    const menuElement = screen.getByText("Menu Content")
    expect(menuElement).toHaveClass("custom-class")
  })

  it("should render children", () => {
    render(
      <Menu>
        <div>Child Element</div>
      </Menu>
    )
    expect(screen.getByText("Child Element")).toBeInTheDocument()
  })

  it("should pass additional props to the HeadlessMenu component", () => {
    render(
      <Menu aria-label="Test Menu" data-testid="test-menu">
        Menu Content
      </Menu>
    )
    const menuElement = screen.getByTestId("test-menu")
    expect(menuElement).toHaveAttribute("aria-label", "Test Menu")
  })
})
