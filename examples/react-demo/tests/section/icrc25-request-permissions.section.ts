import { Page } from "@playwright/test"
import { Section } from "./section.ts"
import { Account, AccountType } from "../page/standards.page.ts"

export class Icrc25RequestPermissionsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc25_request_permissions")
  }

  async approvePermissions(account: Account): Promise<Page> {
    const [popup] = await Promise.all([this.page.waitForEvent("popup"), this.submitButton.click()])
    if (account.type === AccountType.MockedSigner) await popup.click("#approve", { timeout: 20000 })

    await this.waitForResponse()

    return popup
  }
}
