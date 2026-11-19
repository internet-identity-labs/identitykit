import { Locator, Page } from "@playwright/test"
import { readCodeMirrorJson } from "../../../shared/e2e/codemirror.js"
import { MAX_WAIT_MS } from "../../../shared/e2e/config.js"

export abstract class Section {
  readonly submitButton: Locator
  private readonly requestSection: Locator
  private readonly responseSection: Locator

  protected constructor(
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

  async getRequestJson(): Promise<string> {
    return readCodeMirrorJson(this.requestSection, { timeout: 10000 })
  }

  async getResponseJson(): Promise<string> {
    await this.responseSection.waitFor({ state: "visible", timeout: 10000 })
    return readCodeMirrorJson(this.responseSection)
  }

  async clickSubmitButton(): Promise<void> {
    await this.submitButton.click({ timeout: 10000 })
  }

  async waitForResponse(): Promise<void> {
    await this.page
      .locator(`#${this.section} #response-section-${this.section} div.cm-line:nth-child(2)`)
      .waitFor({ state: "visible", timeout: MAX_WAIT_MS })
  }
}
