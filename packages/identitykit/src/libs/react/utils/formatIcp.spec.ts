import { formatIcp } from "./formatIcp"

describe("formatIcp", () => {
  it("should format value with 2 decimal places", () => {
    expect(formatIcp(123.456789)).toBe("123.456789")
  })

  it("should format value with 8 decimal places", () => {
    expect(formatIcp(123.45678912)).toBe("123.45678912")
  })

  it("should truncate value to 8 decimal places", () => {
    expect(formatIcp(123.4567891234)).toBe("123.45678912")
  })

  it('should return "0" for zero value', () => {
    expect(formatIcp(0)).toBe("0")
  })

  it("should handle integer values", () => {
    expect(formatIcp(123)).toBe("123")
  })

  it("should handle values with trailing decimal zeros", () => {
    expect(formatIcp(123.4)).toBe("123.4")
  })
})
