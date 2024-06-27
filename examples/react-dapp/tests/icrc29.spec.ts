import { test, expect } from "@playwright/test"
import { basicRequest } from "../src/data/icrc29_status"
import {
  verifySectionVisibility,
  verifyRequestSection,
  verifyResponseSection,
  submitRequest,
  chooseWallet,
} from "./utils"

const origin = "http://localhost:3001"

test.describe("icrc29", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(origin)
  })

  test("Ready handshake", async ({ page }) => {
    const sectionId = "icrc29_status"

    await verifySectionVisibility(page, sectionId)
    await verifyRequestSection(page, sectionId, basicRequest)
    await verifyResponseSection(page, sectionId, "{}")

    await submitRequest(page, sectionId)
    await chooseWallet(page)
    await page.waitForFunction((sectionId) => {
      const responseSection = document.querySelector(`#${sectionId} #response-section-e2e`)
      return responseSection && responseSection.textContent !== "{}"
    }, sectionId)

    const responseSection = page.locator(`#${sectionId} #response-section-e2e`)
    expect(responseSection).toContainText(`"result": "ready"`) // Check actual method
    expect(responseSection).toContainText(`"origin": "${origin}"`) // Check RPC structure
    expect(responseSection).toContainText(`"jsonrpc": "2.0",`) // Check RPC structure
    expect(responseSection).toContainText(`"id": `) // Check RPC structure
  })
})
