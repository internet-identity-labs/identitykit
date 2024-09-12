import { Page } from "@playwright/test"
import { Section } from "./section.ts"
import { Account, AccountType } from "../page/standards.page.ts"

export class Icrc25RequestPermissionsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc25_request_permissions")
  }

  async approvePermissions(account: Account): Promise<void> {
    const [popup] = await Promise.race([
      this.page.waitForEvent("popup"),
      this.submitButton.click(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Popup did not open within timeout")), 10000)
      ),
    ])
    if (account.type === AccountType.MockedSigner) {
      await this.page.waitForFunction(
        async () => {
          const approveButton = await popup.waitForSelector("#approve", {
            state: "attached",
            timeout: 2000,
          })
          if (!approveButton) return false
          await popup.click("#approve")
          await popup.close()
          return true
        },
        { timeout: 20000 }
      )
    }
  }
}
