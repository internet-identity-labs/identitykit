import { BrowserContext, Page } from "@playwright/test"
import { Section } from "./section.js"
import { Account, AccountType } from "../page/standards.page.js"
import { waitForPopup, waitUntil } from "../helpers/helpers.js"

export class Icrc25RequestPermissionsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc25_request_permissions")
  }

  async approvePermissions(context: BrowserContext, account: Account): Promise<void> {
    await waitForPopup(context, async () => await this.submitButton.click())
    const popup = context.pages()[context.pages().length - 1]
    await popup!.bringToFront()
    if (account.type === AccountType.MockedSigner)
      await popup!.click("#approve", { timeout: 20000 })
    await waitUntil(
      async () => {
        return !context.pages().includes(popup!)
      },
      { timeout: 15000, timeoutMsg: "Popup wasn't closed" }
    )
  }
}
