import { fireEvent, render, screen } from "@testing-library/react"
import { ModalHeader } from "./modal-header"

jest.mock("../ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe("ModalHeader", () => {
  const onBackMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders without crashing", () => {
    render(<ModalHeader onBack={onBackMock} isViewAll={false} />)
    expect(screen.getByText("Connect your wallet")).toBeInTheDocument()
  })

  it("renders back button when isViewAll is true", () => {
    render(<ModalHeader onBack={onBackMock} isViewAll={true} />)
    expect(screen.getByTestId("svg")).toBeInTheDocument()
  })

  it("does not render back button when isViewAll is false", () => {
    render(<ModalHeader onBack={onBackMock} isViewAll={false} />)
    expect(screen.queryByTestId("svg")).not.toBeInTheDocument()
  })

  it("calls onBack when back button is clicked", () => {
    render(<ModalHeader onBack={onBackMock} isViewAll={true} />)
    const backButton = screen.getByTestId("svg")
    fireEvent.click(backButton)
    expect(onBackMock).toHaveBeenCalledTimes(1)
  })
})
