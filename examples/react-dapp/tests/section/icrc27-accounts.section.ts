import { BrowserContext, Page } from "@playwright/test"
import { Section } from "./section.js"
import { waitForPopup, waitUntil } from "../helpers/helpers.js"

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
    await waitUntil(async () => {
      return !context.pages().includes(popup!)
    })
    await this.page.waitForTimeout(2000)
  }

  async selectAccountsNFID(context: BrowserContext): Promise<void> {
    await waitForPopup(context, async () => await this.submitButton.click())
    const popup = context.pages()[context.pages().length - 1]
    await popup!.bringToFront()
    await popup!.click("//button[.//text()='Connect']")
    await popup!.click("//button[.//text()='Continue to app']")
    await waitUntil(async () => {
      return !context.pages().includes(popup!)
    })
    await this.page.waitForTimeout(2000)
  }
}
