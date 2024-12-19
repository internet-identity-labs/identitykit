import { BrowserContext, Page } from "@playwright/test"
import { Section } from "./section.ts"

export class Icrc25AccountsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc27_accounts")
  }

  async selectAccountsMocked(context: BrowserContext) {
    await this.submitButton.click()
    const popup = await context.pages()[context.pages().length - 1]
    await popup.click("#acc_0")
    await popup.click("#acc_1")
    await popup.click("#approve")
    await popup.close()
  }

  async selectAccountsNFID(page: Page, context: BrowserContext): Promise<void> {
    let popup
    let done = false
    while (!done) {
      try {
        await page.waitForTimeout(1000)
        if (!(await this.submitButton.isDisabled())) {
          await this.submitButton.click()
          popup = await page.waitForEvent("popup", { timeout: 5000 })
        }
        if (popup)
          await context
            .pages()[2]
            .locator('//button[.//text()="Connect"]')
            .waitFor({ state: "attached", timeout: 5000 })
        await context.pages()[2].locator('//button[.//text()="Connect"]').click()

        await context
          .pages()[2]
          .locator('//button[.//text()="Continue to app"]')
          .waitFor({ state: "attached", timeout: 5000 })

        await context.pages()[2].locator('//button[.//text()="Continue to app"]').click()

        await page.waitForTimeout(1000)
        done = true
      } catch (e) {
        /* empty */
      }
    }
  }
}
