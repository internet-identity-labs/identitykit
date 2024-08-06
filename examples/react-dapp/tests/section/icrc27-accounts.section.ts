import { BrowserContext, Page } from "@playwright/test"
import { Section } from "./section"

export class Icrc25AccountsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc27_accounts")
  }

  async selectAccountsMocked() {
    const [popup] = await Promise.all([this.page.waitForEvent("popup"), this.submitButton.click()])
    await popup.click("#acc_0")
    await popup.click("#acc_1")
    await popup.click("#approve")
    await popup.close()
  }

  async selectAccountsNFID(page: Page, context: BrowserContext, timeout: number): Promise<void> {
    const section = this

    async function tryClickApprove(): Promise<void> {
      let popup
      while (true) {
        try {
          await page.waitForTimeout(1000)
          if (!(await section.submitButton.isDisabled())) {
            await section.submitButton.click()
            popup = await page.waitForEvent("popup", { timeout: 5000 })
          }
          if (popup)
            await context
              .pages()[2]
              .locator('//button[.//text()="Approve"]')
              .waitFor({ state: "attached", timeout: 5000 })
          await context.pages()[2].locator('//button[.//text()="Approve"]').click()
          await page.waitForTimeout(1000)
          await popup.close()
          break
        } catch (e) {}
      }
    }

    await Promise.race([
      tryClickApprove(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`The "Approve" button wasn't clicked after ${timeout} ms`)),
          timeout
        )
      ),
    ])
  }
}
