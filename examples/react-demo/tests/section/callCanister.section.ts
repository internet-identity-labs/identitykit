import { BrowserContext, expect, Locator, Page } from "@playwright/test"
import { RequestParametersBuilder } from "../helpers/requestParametersBuilder.ts"
import { waitUntil } from "../helpers/helpers.js"

export class CallCanisterSection {
  constructor(public readonly page: Page) {}

  private _selectedMethod = "icrc2_approve"
  get selectedMethod(): string {
    return this._selectedMethod
  }

  set selectedMethod(value: string) {
    this._selectedMethod = value
  }

  requestBuilder = new RequestParametersBuilder(this.page, () => this.selectedMethod)
  private popup

  get selectMethodButton(): Locator {
    return this.page.locator("#select-request")
  }

  get callCanisterRequestSection(): Locator {
    return this.page.locator(`#${this.selectedMethod} #request-section div.cm-content`)
  }

  get callCanisterResponseSection(): Locator {
    return this.page.locator(`#${this.selectedMethod} #response-section div.cm-content`)
  }

  get callCanisterSubmitButton(): Locator {
    return this.page.locator(`#${this.selectedMethod}~div #submit`)
  }

  get NFIDApproveButton(): Locator {
    return this.popup.locator('//button[.//text()="Approve"]')
  }

  availableMethods = {
    icrc2_approve: {
      name: "icrc2_approve",
      locator: (): Locator => this.page.locator("#option_ICRC-2approve"),
    },
    icrc2_transfer: {
      name: "icrc2_transfer",
      locator: (): Locator => this.page.locator("#option_ICRC-2transfer"),
    },
    icrc1_transfer: {
      name: "icrc1_transfer",
      locator: (): Locator => this.page.locator("#option_ICRC-1transfer"),
    },
    icp_transfer: {
      name: "transfer",
      locator: (): Locator => this.page.locator("#option_ICPtransfer"),
    },
    call_to_identityKit_demo_canister: {
      name: "greet_no_consent",
      locator: (): Locator =>
        this.page.locator("#option_CanisterquerycalltoIdentityKitDemocanister"),
    },
    long_running_update_call: {
      name: "greet_update_call",
      locator: (): Locator =>
        this.page.locator("#option_CanisterlongrunningupdatecalltoIdentityKitDemocanister"),
    },
  } as const

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

  async getResponse(): Promise<string | null> {
    return await this.callCanisterResponseSection.textContent({
      state: "visible",
      timeout: 10000,
    })
  }

  async getResponseJson(): Promise<string> {
    const json = await this.getResponse()
    return json ? JSON.parse(json) : {}
  }

  async waitForResponse(): Promise<void> {
    await this.callCanisterResponseSection.locator("div.cm-line:nth-child(2)").waitFor({
      state: "visible",
      timeout: 20000,
    })
  }

  async waitForNotEmptyResponse(timeout?: number) {
    timeout = timeout ? timeout : 10000
    await waitUntil(
      async () => {
        let value = await this.callCanisterResponseSection.textContent()
        return value != ""
      },
      {
        interval: 1000,
        timeout: timeout,
        timeoutMsg: `Empty response section after ${timeout} sec`,
      }
    )
  }

  async checkRequestResponse(expectedRequest) {
    const initialRequest = await this.getRequestJson()
    expect(initialRequest).toStrictEqual(expectedRequest)

    const initialResponse = await this.getResponseJson()
    expect(initialResponse).toStrictEqual({})
  }

  async checkNFIDPopupText(expectedText): Promise<void> {
    await this.popup.bringToFront()
    const header = await this.popup
      .locator(".items-center.mt-10.text-sm.text-center a")
      .locator("..")
      .textContent()
    const bodyTexts = await this.popup
      .locator("div.flex.flex-col.flex-1.h-full p:visible")
      .allInnerTexts()

    expect(header.trim() + "," + bodyTexts.map((text) => text.trim())).toEqual(
      expectedText.join(",")
    )
  }

  async clickSubmitButtonAndGetPopup(context: BrowserContext) {
    await this.callCanisterSubmitButton.click()
    await this.page.waitForTimeout(2000)
    this.popup = context.pages()[context.pages().length - 1]
    await this.popup.bringToFront()
  }
}
