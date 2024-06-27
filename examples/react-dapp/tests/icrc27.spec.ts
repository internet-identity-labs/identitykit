import { test, expect } from "@playwright/test"
import { basicRequest } from "../src/data/icrc27_get_accounts"
import {
  verifySectionVisibility,
  verifyRequestSection,
  verifyResponseSection,
  submitRequest,
  approveWithDefaultSigner,
  getPermissions,
} from "./utils"

const origin = "http://localhost:3001"

test.describe("icrc27", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(origin)
  })

  test("Get accounts", async ({ page }) => {
    await test.step("icrc25_request_permissions ", async () => {
      return await getPermissions(page)
    })

    await test.step("icrc27_get_accounts ", async () => {
      const sectionId = "icrc27_get_accounts"

      await verifySectionVisibility(page, sectionId)
      await verifyRequestSection(page, sectionId, basicRequest)
      await verifyResponseSection(page, sectionId, "{}")

      await submitRequest(page, sectionId)

      const iframeElement = await page.$("#signer-iframe")
      const frame = await iframeElement!.contentFrame()
      await frame!.click("#acc_0")
      await approveWithDefaultSigner(page, sectionId)

      const responseSection = page.locator(`#${sectionId} #response-section-e2e`)
      expect(responseSection).toContainText(`"origin": "${origin}"`)
      expect(responseSection).toContainText(`"accounts": [`)
      expect(responseSection).toContainText(`"principal": `)
      expect(responseSection).toContainText(`"subaccount": `)
    })
  })
})
