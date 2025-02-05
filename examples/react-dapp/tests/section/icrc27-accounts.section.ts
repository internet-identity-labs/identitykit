import { BrowserContext, Page } from "@playwright/test"
import { Section } from "./section.js"
import { waitForPopup } from "../helpers/helpers.js"

export class Icrc25AccountsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc27_accounts")
  }

  async selectAccountsMocked(context: BrowserContext) {
    await waitForPopup(context, async () => await this.submitButton.click())
    const popup = context.pages()[context.pages().length - 1]
    await popup!.bringToFront()
    await popup!.click("#acc_0")
    await popup!.click("#acc_1")
    await popup!.click("#approve")
    try {
      await popup!.waitForEvent("close")
    } catch (e) {
      /* empty */
    }
  }

  async selectAccountsNFID(context: BrowserContext): Promise<void> {
    await waitForPopup(context, async () => await this.submitButton.click())
    const popup = context.pages()[context.pages().length - 1]
    await popup!.bringToFront()
    await popup!.click("//button[.//text()='Connect']")
    await popup!.click("//button[.//text()='Continue to app']")
    try {
      await popup!.waitForEvent("close")
    } catch (e) {
      /* empty */
    }
  }
}
