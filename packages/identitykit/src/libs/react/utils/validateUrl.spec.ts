import { validateUrl } from "./validateUrl"

describe("validateUrl", () => {
  it("should return true for a valid URL without schema", () => {
    expect(validateUrl("example.com")).toBe(true)
  })

  it("should return true for a valid URL with HTTP schema", () => {
    expect(validateUrl("http://example.com")).toBe(true)
  })

  it("should return true for a valid URL with HTTPS schema", () => {
    expect(validateUrl("https://example.com")).toBe(true)
  })

  it("should return true for a valid URL with port and path", () => {
    expect(validateUrl("https://example.com:8080/path/to/resource")).toBe(true)
  })

  it("should return true for a valid URL with query parameters and fragment", () => {
    expect(validateUrl("https://example.com/path?query=param#fragment")).toBe(true)
  })

  it('should return "Invalid URL" for an invalid URL with spaces', () => {
    expect(validateUrl("https://example .com")).toBe(false)
  })

  it('should return "Invalid URL" for an invalid URL without a domain', () => {
    expect(validateUrl("https://")).toBe(false)
  })

  it('should return "Invalid URL" for a URL with invalid characters', () => {
    expect(validateUrl("https://example.com/<script>alert(1)</script>")).toBe(false)
  })

  it('should return "Invalid URL" for a URL with only a schema', () => {
    expect(validateUrl("http://")).toBe(false)
  })
})
