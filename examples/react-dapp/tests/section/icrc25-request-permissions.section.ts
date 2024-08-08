import { Page } from "@playwright/test"
import { Section } from "./section.ts"
import { Account, AccountType } from "../page/demo.page.ts"

export class Icrc25RequestPermissionsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc25_request_permissions")
  }

  async approvePermissions(account: Account, timeout: number = 30000): Promise<void> {
    const [popup] = await Promise.all([this.page.waitForEvent("popup"), this.submitButton.click()])
    let isPopupClosed = false
    if (account.type == AccountType.MockedSigner) {
      while (!isPopupClosed) {
        try {
          await popup.waitForSelector("#approve", { state: "attached", timeout: 2000 })
          await popup.click("#approve")
          await popup.close()
          isPopupClosed = true
        } catch (e) {
          /* empty */
        }
      }
    }
  }
}
