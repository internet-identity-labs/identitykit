import { BrowserContext, expect, Locator, Page } from "@playwright/test"
import { Section } from "./section.ts"
import { Account, StandardsPage } from "../page/standards.page.ts"
import { Icrc25RequestPermissionsSection } from "./icrc25-request-permissions.section.ts"

export class Icrc49CallCanisterSection extends Section {
  private selectedMethod = "greet_no_consent"
  private popup

  constructor(public readonly page: Page) {
    super(page, "icrc49_call_canister")
  }

  get callCanisterRequestSection(): Locator {
    return this.page.locator(
      `#request-section-${this.section}-${this.selectedMethod} div.cm-content`
    )
  }

  get callCanisterResponseSection(): Locator {
    return this.page.locator(
      `#response-section-${this.section}-${this.selectedMethod} div.cm-content`
    )
  }

  get callCanisterSubmitButton(): Locator {
    return this.page.locator(`#submit-${this.section}-${this.selectedMethod}`)
  }

  get selectMethodButton() {
    return this.page.locator("#select-request")
  }

  async openPopup(context: BrowserContext) {
    await this.callCanisterSubmitButton.click()
    await this.page.waitForTimeout(1000)
    this.popup = context.pages()[context.pages().length - 1]
    await this.popup.bringToFront()
  }

  async setSelectedMethod(method) {
    this.selectedMethod = method.name
    await this.selectMethodButton.click()
    await method.locator().click()
  }

  async getRequestJson(): Promise<string> {
    const json = await this.callCanisterRequestSection.textContent({
      state: "visible",
      timeout: 10000,
    })
    return json ? JSON.parse(json) : {}
  }

  async getResponseJson(): Promise<string> {
    const json = await this.callCanisterResponseSection.textContent({
      state: "visible",
      timeout: 10000,
    })
    return json ? JSON.parse(json) : {}
  }

  async waitForResponse(): Promise<void> {
    await this.callCanisterResponseSection.locator("div.cm-line:nth-child(2)").waitFor({
      state: "visible",
      timeout: 20000,
    })
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

  get mockedApproveButton(): Locator {
    return this.popup.locator("#approve")
  }

  get nfidApproveButton(): Locator {
    return this.popup.locator('//button[.//text()="Approve"]')
  }

  async getMockedPopupText() {
    await this.popup.locator("div > small").last().waitFor({ state: "visible", timeout: 10000 })
    return await this.popup.locator(`div > small`).allInnerTexts()
  }

  async getNFIDPopupText(popup) {
    const header = await popup
      .locator(".items-center.mt-10.text-sm.text-center a")
      .locator("..")
      .textContent()

    const bodyTexts = await popup
      .locator("div.flex.flex-col.flex-1.h-full p:visible")
      .allInnerTexts()

    return header.trim() + "," + bodyTexts.map((text) => text.trim())
  }

  async checkPopupTextNFID(
    page: Page,
    context: BrowserContext,
    textsExpected: string[]
  ): Promise<void> {
    await this.popup.bringToFront()
    expect(await this.getNFIDPopupText(await context.pages()[2])).toEqual(textsExpected.join(","))
  }

  async setCallCanisterOwner(sender: string): Promise<void> {
    await this.page.fill(
      `#request-section-${this.section}-${this.selectedMethod} .cm-content .cm-line:nth-child(5) span`,
      sender
    )
  }

  availableMethods = {
    selectBasicTab: {
      name: "no_consent",
      locator: (): Locator => this.page.locator("#option_Basic"),
    },
    selectConsentTab: {
      name: "greet",
      locator: (): Locator => this.page.locator("#option_Withconsentmessage"),
    },
    selectICPTransferTab: {
      name: "transfer",
      locator: (): Locator => this.page.locator("#option_ICPtransfer"),
    },
    selectIcrc2ApprovalTab: {
      name: "icrc2_approve",
      locator: (): Locator => this.page.locator("#option_ICRC-2approve"),
    },
    selectIcrc2TransferTab: {
      name: "icrc2_transfer_from",
      locator: (): Locator => this.page.locator("#option_ICRC-2transfer"),
    },
    selectIcrc1TransferTab: {
      name: "icrc1_transfer",
      locator: (): Locator => this.page.locator("#option_ICRC-1transfer"),
    },
  }
}
