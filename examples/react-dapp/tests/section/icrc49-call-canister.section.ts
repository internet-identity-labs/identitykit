import { BrowserContext, expect, Locator, Page } from "@playwright/test"
import { Section } from "./section.js"
import { Account, StandardsPage } from "../page/standards.page.js"
import { Icrc25RequestPermissionsSection } from "./icrc25-request-permissions.section.js"
import { waitForPopup, waitUntil } from "../../../shared/e2e/helpers.js"
import { readCodeMirrorJson, updateCodeMirrorJson } from "../../../shared/e2e/codemirror.js"
import { MAX_WAIT_MS } from "../../../shared/e2e/config.js"
import { clickInSignerPopup } from "../../../shared/e2e/signer-popup.js"
import { Method, RequestState } from "../helpers/types.js"

export class Icrc49CallCanisterSection extends Section {
  private selectedMethod = "greet_no_consent"
  private popup: Page | undefined

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
    await this.callCanisterSubmitButton.waitFor({ state: "visible", timeout: 10000 })
    await waitForPopup(context, async () => await this.callCanisterSubmitButton.click())
    this.popup = context.pages()[context.pages().length - 1]
    await this.popup!.bringToFront()
  }

  async setSelectedMethod(method: Method) {
    this.selectedMethod = method.name
    await this.selectMethodButton.click()
    await method.locator().click({ timeout: 10000 })
  }

  async getRequestJson(): Promise<string> {
    return readCodeMirrorJson(this.callCanisterRequestSection, { timeout: 10000 })
  }

  async getResponseJson(): Promise<string> {
    return readCodeMirrorJson(this.callCanisterResponseSection, { timeout: 15000 })
  }

  async waitForResponse(): Promise<void> {
    await this.callCanisterResponseSection.waitFor({ state: "attached", timeout: MAX_WAIT_MS })
    await this.callCanisterResponseSection.locator("div.cm-line:nth-child(2)").waitFor({
      state: "visible",
      timeout: 20000,
    })
  }

  async loginAndApprovePermissions(
    demoPage: StandardsPage,
    requestPermissionSection: Icrc25RequestPermissionsSection,
    account: Account,
    context: BrowserContext
  ) {
    await demoPage.login(account)
    await requestPermissionSection.approvePermissions(context, account)
  }

  async checkRequestResponse(section: Icrc49CallCanisterSection, expectedRequest: RequestState) {
    const initialRequest = await section.getRequestJson()
    expect(initialRequest).toStrictEqual(expectedRequest)

    const initialResponse = await section.getResponseJson()
    expect(initialResponse).toStrictEqual({})
  }

  get mockedApproveButton(): Locator {
    return this.popup!.locator("#approve")
  }

  get nfidApproveButton(): Locator {
    return this.popup!.locator('//button[.//text()="Approve"]')
  }

  async approveInNfidPopup(): Promise<void> {
    await clickInSignerPopup(this.popup!, this.nfidApproveButton)
  }

  async getMockedPopupText() {
    await this.popup!.locator("div > small")
      .last()
      .waitFor({ state: "visible", timeout: MAX_WAIT_MS })
    return await this.popup!.locator(`div > small`).allInnerTexts()
  }

  async getNFIDPopupText(popup: Page) {
    const selector = popup.locator(".items-center.mt-10.text-sm.text-center a").locator("..")
    await selector.waitFor({ state: "visible", timeout: MAX_WAIT_MS })
    const header = await popup
      .locator(".items-center.mt-10.text-sm.text-center a")
      .locator("..")
      .textContent()

    const bodyTexts = await popup
      .locator("div.flex.flex-col.flex-1.h-full p:visible")
      .allInnerTexts()

    return header!.trim() + "," + bodyTexts.map((text) => text.trim())
  }

  async checkPopupTextNFID(textsExpected: string[]): Promise<void> {
    await this.popup!.bringToFront()
    expect(await this.getNFIDPopupText(this.popup!)).toEqual(textsExpected.join(","))
  }

  /** Overrides `params` fields of the selected call-canister request (e.g. sender, arg). */
  async setRequestParams(params: Record<string, string>): Promise<void> {
    await waitUntil(
      async () =>
        !!(await readCodeMirrorJson<{ params?: unknown }>(this.callCanisterRequestSection)).params,
      { timeout: MAX_WAIT_MS, timeoutMsg: "Call canister request editor stayed empty" }
    )
    await updateCodeMirrorJson<{ params: Record<string, unknown> }>(
      this.callCanisterRequestSection,
      (request) => ({ ...request, params: { ...request.params, ...params } })
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
