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
    await waitUntil(
      async () => {
        return !context.pages().includes(popup!)
      },
      { timeout: 15000, timeoutMsg: "Popup wasn't closed" }
    )
  }

  async selectAccountsNFID(context: BrowserContext): Promise<void> {
    await waitForPopup(context, async () => await this.submitButton.click())
    const popup = context.pages()[context.pages().length - 1]
    await popup!.bringToFront()
    await popup!.click("//button[.//text()='Connect']", { timeout: 40000 })
    await popup!.click("//button[.//text()='Continue to app']", { timeout: 30000 })
    await waitUntil(
      async () => {
        return !context.pages().includes(popup!)
      },
      { timeout: 15000, timeoutMsg: "Popup wasn't closed" }
    )
  }
}
