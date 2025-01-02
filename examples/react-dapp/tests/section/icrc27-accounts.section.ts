import { BrowserContext, Page } from "@playwright/test"
import { Section } from "./section.ts"

export class Icrc25AccountsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc27_accounts")
  }

  async selectAccountsMocked(context: BrowserContext) {
    await this.submitButton.click()
    await this.page.waitForTimeout(1000)
    const popup = await context.pages()[context.pages().length - 1]
    await popup.click("#acc_0")
    await popup.click("#acc_1")
    await popup.click("#approve")
    await popup.close()
  }

  async selectAccountsNFID(page: Page, context: BrowserContext): Promise<void> {
    await this.submitButton.click()
    await this.page.waitForTimeout(1000)
    const popup = await context.pages()[context.pages().length - 1]
    await popup.click("//button[.//text()='Connect']")
    await popup.click("//button[.//text()='Continue to app']")
  }
}
