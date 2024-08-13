import { openPopup } from "./openPopup"

describe("openPopup", () => {
  beforeAll(() => {
    jest.spyOn(window, "open").mockImplementation(() => null as unknown as Window)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it("should call window.open with correct parameters", () => {
    const url = "https://example.com"

    openPopup(url)

    expect(window.open).toHaveBeenCalledWith(url, "_blank")
  })
})
