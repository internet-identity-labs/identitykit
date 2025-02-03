import { BrowserContext, expect, Locator, Page } from "@playwright/test"
import { RequestParametersBuilder } from "../helpers/requestParametersBuilder.js"
import { waitForPopup, waitUntil } from "../helpers/helpers.js"
import { Method, RequestState } from "../helpers/types.js"
import { DemoPage } from "../page/demoPage.js"

export class CallCanisterSection extends DemoPage {
  private popup: Page | undefined
  requestBuilder: RequestParametersBuilder

  constructor(public readonly page: Page) {
    super(page)
    this.requestBuilder = new RequestParametersBuilder(this.page, () => this.selectedMethod)
  }

  private _selectedMethod = "icrc2_approve"
  get selectedMethod(): string {
    return this._selectedMethod
  }

  set selectedMethod(value: string) {
    this._selectedMethod = value
  }

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
    return this.popup!.locator('//button[.//text()="Approve"]')
  }

  availableMethods: { [key: string]: Method } = {
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

  async setSelectedMethod(method: Method) {
    this.selectedMethod = method.name
    await this.selectMethodButton.click({ timeout: 20000 })
    await method.locator().click({ timeout: 5000 })
  }

  async getRequestJson(): Promise<string> {
    const json = await this.callCanisterRequestSection.textContent({
      timeout: 10000,
    })
    return json ? JSON.parse(json) : {}
  }

  async getResponse(): Promise<string | null> {
    return await this.callCanisterResponseSection.textContent({
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
        const value = await this.callCanisterResponseSection.textContent({ timeout: 0 })
        return value != ""
      },
      {
        interval: 1000,
        timeout: timeout,
        timeoutMsg: `Empty response section after ${timeout} sec`,
      }
    )
  }

  async checkRequestResponse(expectedRequest: RequestState) {
    const initialRequest = await this.getRequestJson()
    expect(initialRequest).toStrictEqual(expectedRequest)

    const initialResponse = await this.getResponseJson()
    expect(initialResponse).toStrictEqual({})
  }

  async checkNFIDPopupText(expectedText: RequestState): Promise<void> {
    await this.popup!.bringToFront()
    const header = await this.popup!.locator(".items-center.mt-10.text-sm.text-center a")
      .locator("..")
      .textContent()
    const bodyTexts = await this.popup!.locator(
      "div.flex.flex-col.flex-1.h-full p:visible"
    ).allInnerTexts()

    if (Array.isArray(expectedText)) {
      expect(header!.trim() + "," + bodyTexts.map((text: string) => text.trim()).join(",")).toEqual(
        expectedText.join(",")
      )
    } else {
      throw new Error("Invalid type of expectedText. Expected string[]")
    }
  }

  async clickSubmitButtonAndGetPopup(context: BrowserContext) {
    await waitForPopup(context, async () => await this.callCanisterSubmitButton.click())
    this.popup = context.pages()[context.pages().length - 1]
    await this.popup!.bringToFront()
  }

  async verifyThemeChanging() {
    const themeColor = await this.getCurrentThemeColor()
    await this.changeThemeButton.click()
    const newThemeColor = await this.getCurrentThemeColor()
    await this.changeThemeButton.click()
    const previousThemeColor = await this.getCurrentThemeColor()
    expect(themeColor).toEqual("rgb(255, 255, 255)")
    expect(newThemeColor).toEqual("rgb(20, 21, 24)")
    expect(previousThemeColor).toEqual("rgb(255, 255, 255)")
  }

  async getCurrentThemeColor(): Promise<string> {
    return this.page
      .locator("#themeColor")
      .evaluate((it) => getComputedStyle(it).getPropertyValue("background-color"))
  }
}
