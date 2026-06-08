import { jest } from "@jest/globals"
import { fireEvent, render, screen } from "@testing-library/react"

jest.unstable_mockModule(new URL("../../ui/tooltip.tsx", import.meta.url).pathname, () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const { Header } = await import("./header")

describe("ModalHeader", () => {
  const onBackMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders without crashing", () => {
    render(<Header onBack={onBackMock} isViewAll={false} />)
    expect(screen.getByText("Connect your wallet")).toBeInTheDocument()
  })

  it("renders back button when isViewAll is true", () => {
    render(<Header onBack={onBackMock} isViewAll={true} />)
    expect(screen.getByTestId("svg")).toBeInTheDocument()
  })

  it("does not render back button when isViewAll is false", () => {
    render(<Header onBack={onBackMock} isViewAll={false} />)
    expect(screen.queryByTestId("svg")).not.toBeInTheDocument()
  })

  it("calls onBack when back button is clicked", () => {
    render(<Header onBack={onBackMock} isViewAll={true} />)
    const backButton = screen.getByTestId("svg")
    fireEvent.click(backButton)
    expect(onBackMock).toHaveBeenCalledTimes(1)
  })
})
