import { test, expect } from "@playwright/test"
import { basicRequest } from "../src/data/icrc25_request_permissions"
import { basicRequest as icrc25GrantedRequest } from "../src/data/icrc25_granted_permissions"
import { basicRequest as icrc25RevokeRequest } from "../src/data/icrc25_revoke_permissions"
import { basicRequest as icrc25SupportedRequest } from "../src/data/icrc25_supported_standards"
import {
  verifySectionVisibility,
  verifyRequestSection,
  verifyResponseSection,
  submitRequest,
  approveWithDefaultSigner,
  getPermissions,
  chooseWallet,
} from "./utils"

const origin = "http://localhost:3001"

test.describe("icrc25", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(origin)
  })

  test("Request permissions", async ({ page }) => {
    const sectionId = "icrc25_request_permissions"
    const expectedResponse = JSON.stringify(
      {
        scopes: [
          {
            method: "icrc27_get_accounts",
          },
          {
            method: "icrc34_get_delegation",
          },
          {
            method: "icrc49_call_canister",
          },
        ],
      },
      null,
      2
    )

    await verifySectionVisibility(page, sectionId)
    await verifyRequestSection(page, sectionId, basicRequest)
    await verifyResponseSection(page, sectionId, "{}")

    await submitRequest(page, sectionId)
    await approveWithDefaultSigner(page, sectionId)

    const responseSection = page.locator(`#${sectionId} #response-section-e2e`)
    expect(responseSection).toContainText(`"origin": "${origin}"`)
    expect(responseSection).toContainText(expectedResponse)
  })

  test("Check granted permissions", async ({ page }) => {
    await test.step("icrc25_request_permissions", async () => {
      await getPermissions(page)
    })

    await test.step("icrc25_granted_permissions", async () => {
      const sectionId = "icrc25_granted_permissions"

      await verifySectionVisibility(page, sectionId)
      await verifyRequestSection(page, sectionId, icrc25GrantedRequest)
      await verifyResponseSection(page, sectionId, "{}")
      await submitRequest(page, sectionId, true)

      const responseSection = page.locator(`#${sectionId} #response-section-e2e`)
      expect(responseSection).toContainText(`"origin": "${origin}"`)
      expect(responseSection).toContainText(`"scopes": [`)
      expect(responseSection).toContainText(`"method": "icrc27_get_accounts"`)
    })
  })

  test("Revoke permissions", async ({ page }) => {
    const sectionId = "icrc25_revoke_permissions"

    await verifySectionVisibility(page, sectionId)
    await verifyRequestSection(page, sectionId, icrc25RevokeRequest)
    await verifyResponseSection(page, sectionId, "{}")

    await submitRequest(page, sectionId)
    await approveWithDefaultSigner(page, sectionId)

    const responseSection = page.locator(`#${sectionId} #response-section-e2e`)
    expect(responseSection).toContainText(`"origin": "${origin}"`)
    expect(responseSection).not.toContainText(`icrc27_get_accounts`)

    // Check that the permissions were revoked in granted permissions
    await verifySectionVisibility(page, "icrc25_granted_permissions")
    await verifyRequestSection(page, "icrc25_granted_permissions", icrc25GrantedRequest)
    await verifyResponseSection(page, "icrc25_granted_permissions", "{}")
    await submitRequest(page, "icrc25_granted_permissions", true)

    const grantedResponse = page.locator(`#icrc25_granted_permissions #response-section-e2e`)
    expect(grantedResponse).toContainText(`"origin": "${origin}"`)
    expect(grantedResponse).toContainText(`"scopes": [`)
    expect(grantedResponse).not.toContainText(`"method": "icrc27_get_accounts"`)
  })

  test("Check supported standards", async ({ page }) => {
    await test.step("icrc25_supported_standards", async () => {
      const sectionId = "icrc25_supported_standards"

      await verifySectionVisibility(page, sectionId)
      await verifyRequestSection(page, sectionId, icrc25SupportedRequest)
      await verifyResponseSection(page, sectionId, "{}")

      await submitRequest(page, sectionId)
      await chooseWallet(page)
      await page.waitForFunction((sectionId) => {
        const responseSection = document.querySelector(`#${sectionId} #response-section-e2e`)
        return responseSection && responseSection.textContent !== "{}"
      }, sectionId)

      const responseSection = page.locator(`#${sectionId} #response-section-e2e`)
      expect(responseSection).toContainText(`"ICRC-25"`)
      expect(responseSection).toContainText(`"ICRC-27"`)
      expect(responseSection).toContainText(`"ICRC-28"`)
      expect(responseSection).toContainText(`"ICRC-29"`)
      expect(responseSection).toContainText(`"ICRC-34"`)
    })
  })
})
