import { BrowserContext, expect, Page } from "@playwright/test"
import { Section } from "./section.ts"
import { Account, StandardsPage } from "../page/standards.page.ts"
import { Icrc25RequestPermissionsSection } from "./icrc25-request-permissions.section.ts"

export class Icrc49CallCanisterSection extends Section {
  private selectedMethod = "greet_no_consent"

  constructor(public readonly page: Page) {
    super(page, "icrc49_call_canister")
  }

  setSelectedMethod(method: string) {
    this.selectedMethod = method
  }

  async openPopup(): Promise<Page> {
    const [popup] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.page.locator(`#submit-${this.section}-${this.selectedMethod}`).click(),
    ])

    return popup
  }

  async getRequestJson(): Promise<string> {
    const json = await this.page
      .locator(`#request-section-${this.section}-${this.selectedMethod} div.cm-content`)
      .textContent({ timeout: 10000 })
    return json ? JSON.parse(json) : {}
  }

  async getResponseJson(): Promise<string> {
    const responseSection = this.page.locator(
      `#response-section-${this.section}-${this.selectedMethod} div.cm-content`
    )
    await responseSection.waitFor({ state: "visible", timeout: 10000 })
    const json = await responseSection.textContent()
    return json ? JSON.parse(json) : {}
  }

  async waitForResponse(): Promise<void> {
    await this.page
      .locator(`#response-section-${this.section}-${this.selectedMethod} div.cm-line:nth-child(2)`)
      .waitFor({ state: "visible", timeout: 20000 })
  }

  async selectConsentTab(): Promise<void> {
    this.setSelectedMethod("greet")
    await this.page.locator("#select-request").click()
    await this.page.locator(`#dropdown-options div:nth-child(2)`).click()
  }

  async selectIcrc2ApprovalTab(): Promise<void> {
    this.setSelectedMethod("icrc2_approve")
    await this.page.locator("#select-request").click()
    await this.page.locator(`#dropdown-options div:nth-child(4)`).click()
  }

  async selectIcrc1TransferTab(): Promise<void> {
    this.setSelectedMethod("icrc1_transfer")
    await this.page.locator("#select-request").click()
    await this.page.locator(`#dropdown-options div:nth-child(6)`).click()
  }

  async getPopupTexts(popup: Page): Promise<string[]> {
    await popup.locator("div > small").last().waitFor({ state: "visible" })
    return await popup.locator(`div > small`).allInnerTexts()
  }

  async getPopupTextsNFID(popup: Page): Promise<string[]> {
    let text: string[] = []
    const header = await popup
      .locator(".items-center.mt-10.text-sm.text-center a")
      .locator("..")
      .textContent()
    if (header) {
      text.push(header.trim())
    }
    text = text.concat(await popup.locator("div.flex.flex-col.flex-1.h-full p").allInnerTexts())
    return text
  }

  async approve(popup: Page): Promise<void> {
    await popup.click("#approve", { timeout: 50000 })
  }

  async loginAndApprovePermissions(
    demoPage: StandardsPage,
    requestPermissionSection: Icrc25RequestPermissionsSection,
    account: Account
  ) {
    await demoPage.login(account)
    await requestPermissionSection.approvePermissions(account)
  }

  async checkRequestResponse(section: Icrc49CallCanisterSection, expectedRequest) {
    const initialRequest = await section.getRequestJson()
    expect(initialRequest).toStrictEqual(expectedRequest)

    const initialResponse = await section.getResponseJson()
    expect(initialResponse).toStrictEqual({})
  }

  async checkPopupTextNFID(
    page: Page,
    context: BrowserContext,
    textsExpected: string[]
  ): Promise<void> {
    let done = false
    while (!done) {
      try {
        await page.waitForTimeout(1000)
        if (!(await this.submitButton.isDisabled())) {
          await this.submitButton.click()
          await page.waitForEvent("popup", { timeout: 5000 })
        }
        await context
          .pages()[2]
          .locator('//button[.//text()="Try again"]')
          .waitFor({ state: "attached", timeout: 5000 })
        done = true
      } catch (e) {
        /* empty */
      }
    }
    expect(await this.getPopupTextsNFID(await context.pages()[2])).toEqual(textsExpected)
    //TODO uncomment after fix of nfid wallet delegation
    // await context.pages()[2].locator("//button[.//text()=\"Approve\"]").click()
    await context.pages()[2].close()
  }
}
