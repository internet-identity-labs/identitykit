import { Page } from "@playwright/test"
import { Section } from "./section.ts"
import { Account, AccountType } from "../page/standards.page.ts"
import { waitUntil } from "../helpers/helpers.js"

export class Icrc25RequestPermissionsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc25_request_permissions")
  }

  async approvePermissions(account: Account): Promise<void> {
    const popup = await Promise.race([
      this.page.waitForEvent("popup"),
      this.submitButton.click(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Popup did not open within timeout")), 10000)
      ),
    ])

    if (account.type === AccountType.MockedSigner) {
      await waitUntil(
        async () => {
          const approveButton = await popup.$("#approve")
          if (approveButton) {
            await approveButton.click()
            await popup.close()
            return true
          }
          return false
        },
        { timeout: 10000, message: `Approve button isn't displayed after 10sec}` }
      )
    }
  }
}
