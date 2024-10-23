import { Locator, Page } from "@playwright/test"

export abstract class Section {
  protected readonly submitButton: Locator
  private readonly requestSection: Locator
  private readonly responseSection: Locator

  constructor(
    public readonly page: Page,
    protected readonly section: string
  ) {
    this.requestSection = this.page.locator(
      `#${this.section} #request-section-${this.section} div.cm-content`
    )
    this.responseSection = this.page.locator(
      `#${this.section} #response-section-${this.section} div.cm-content`
    )
    this.submitButton = this.page.locator(`#${this.section} #submit-${this.section}`)
  }

  async getRequestJson(): Promise<string> {
    const json = await this.requestSection.textContent()
    return json ? JSON.parse(json) : {}
  }

  async getResponseJson(): Promise<string> {
    const json = await this.responseSection.textContent()
    return json ? JSON.parse(json) : {}
  }

  async clickSubmitButton(): Promise<void> {
    await this.submitButton.click()
  }

  async waitForResponse(): Promise<void> {
    await this.page.waitForSelector(
      `#${this.section} #response-section-${this.section} div.cm-line:nth-child(1)`
    )
  }
}
