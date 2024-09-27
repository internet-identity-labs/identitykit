import { Locator, Page } from "@playwright/test"

export abstract class Section {
  readonly submitButton: Locator
  private readonly requestSection: Locator
  private readonly responseSection: Locator

  constructor(
    public readonly page: Page,
    protected readonly section: string
  ) {
    this.requestSection = this.page.locator(`#${this.section} #request-section div.cm-content`)
    this.responseSection = this.page.locator(`#${this.section} #response-section div.cm-content`)
    this.submitButton = this.page.locator(`#${this.section} #submit`)
  }

  async setRequestJson(sender: string) {
    const request = {
      method: "icrc49_call_canister",
      params: {
        canisterId: "do25a-dyaaa-aaaak-qifua-cai",
        sender: sender,
        method: "greet_no_consent",
        arg: "RElETAABcQJtZQ==",
      },
    }
    await this.requestSection.clear()
    await this.requestSection.fill(JSON.stringify(request, null, 2))
  }

  async getRequestJson(): Promise<string> {
    const json = (await this.requestSection.textContent()) ?? "{}"
    return JSON.parse(json)
  }

  async getResponseJson(): Promise<string> {
    await this.responseSection.waitFor({ state: "visible" })
    const json = (await this.responseSection.textContent()) ?? "{}"
    return JSON.parse(json)
  }

  async clickSubmitButton(): Promise<void> {
    await this.submitButton.click()
  }

  async waitForResponse(): Promise<void> {
    await this.page
      .locator(`#${this.section} #response-section div.cm-line > span:nth-child(2)`)
      .last()
      .waitFor({ state: "visible" })
  }
}
