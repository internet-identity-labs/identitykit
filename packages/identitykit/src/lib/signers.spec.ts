import * as signers from "./signers"

function isValidBase64Image(base64Str: string): boolean {
  // Regular expression to match base64 image strings with allowed MIME types
  const base64Pattern = /^data:image\/(png|jpeg|gif|webp|bmp|svg\+xml);base64,[a-zA-Z0-9+/=]+$/

  return base64Pattern.test(base64Str)
}

describe("Signer Logos", () => {
  for (const [signerName, signerConfig] of Object.entries(signers)) {
    it(`${signerName} logo should be a valid base64 image`, () => {
      if (!signerConfig.icon) return
      expect(isValidBase64Image(signerConfig.icon)).toBe(true)
    })
  }
})
