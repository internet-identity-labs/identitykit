import { Locator, Page } from "@playwright/test"

export abstract class Section {
  readonly submitButton: Locator
  private readonly requestSection: Locator
  private readonly responseSection: Locator

  constructor(
    public readonly page: Page,
    protected readonly section: string
  ) {
    this.requestSection = this.page.locator(
      `#${this.section} #request-section-${section} div.cm-content`
    )
    this.responseSection = this.page.locator(
      `#${this.section} #response-section-${section} div.cm-content`
    )
    this.submitButton = this.page.locator(`#${this.section} #submit-${section}`)
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
    const json = await this.requestSection.textContent({ timeout: 10000 })
    return json ? JSON.parse(json) : {}
  }

  async getResponseJson(): Promise<string> {
    await this.responseSection.waitFor({ state: "visible", timeout: 10000 })
    const json = await this.responseSection.textContent()
    return json ? JSON.parse(json) : {}
  }

  async clickSubmitButton(): Promise<void> {
    await this.submitButton.click({ timeout: 10000 })
  }

  async waitForResponse(): Promise<void> {
    await this.page
      .locator(`#${this.section} #response-section-${this.section} div.cm-line:nth-child(2)`)
      .waitFor({ state: "visible", timeout: 20000 })
  }
}
