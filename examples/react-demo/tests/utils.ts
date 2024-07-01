import { expect } from "@playwright/test"
import { basicRequest as icrc25RequestPermissionsRequest } from "../src/data/icrc25_request_permissions"

export async function navigateToPage(page, url) {
  await page.goto(url)
}

export async function verifySectionVisibility(page, sectionId) {
  await expect(page.locator(`#${sectionId}`)).toBeVisible()
}

export async function selectRequestTemplate(page, sectionId, index) {
  await page.locator("#select-request").click()
  await page.locator(`#dropdown-options label:nth-child(${index})`).click()
}

export async function verifyRequestSection(page, sectionId, request) {
  const jsonInput = JSON.stringify(request, null, 2)
  const requestSection = page.locator(`#${sectionId} #request-section-e2e`)
  await expect(requestSection).toHaveText(jsonInput)
}

export async function verifyResponseSection(page, sectionId, expectedResponse) {
  const responseSection = page.locator(`#${sectionId} #response-section-e2e`)
  await expect(responseSection).toHaveText(expectedResponse)
}

export async function submitRequest(page, sectionId, isSilent = false) {
  await page.locator(`#${sectionId} #submit`).click()

  if (isSilent) {
    await page.waitForFunction((sectionId) => {
      const responseSection = document.querySelector(`#${sectionId} #response-section-e2e`)
      return responseSection && responseSection.textContent !== "{}"
    }, sectionId)
  }
}

export async function chooseWallet(page) {
  await page.waitForSelector(`#identity-kit-modal`)
  const mockedSigner = page.locator(`#identity-kit-modal #signer_MockedSigner`)
  if (await mockedSigner.isVisible()) {
    await mockedSigner.click()
  }
}

export async function approveWithDefaultSigner(page, sectionId) {
  await chooseWallet(page)

  const iframeElement = await page.$("#signer-iframe")
  const frame = await iframeElement!.contentFrame()

  const approveButton = await frame!.waitForSelector("#approve", { timeout: 10000 })
  if (!approveButton) throw new Error("Approve button not found within 10 seconds")
  await page.waitForTimeout(300)

  await approveButton!.click()
  await page.waitForFunction((sectionId) => {
    const responseSection = document.querySelector(`#${sectionId} #response-section-e2e`)
    return responseSection && responseSection.textContent !== "{}"
  }, sectionId)
}

export async function getPermissions(page) {
  const sectionId = "icrc25_request_permissions"

  await verifySectionVisibility(page, sectionId)
  await verifyRequestSection(page, sectionId, icrc25RequestPermissionsRequest)
  await verifyResponseSection(page, sectionId, "{}")

  await submitRequest(page, sectionId)
  await approveWithDefaultSigner(page, sectionId)
}
