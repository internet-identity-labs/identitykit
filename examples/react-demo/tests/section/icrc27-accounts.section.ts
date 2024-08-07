import { Page } from "@playwright/test"
import { Section } from "./section"

export class Icrc25AccountsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc27_accounts")
  }

  async selectAccounts(): Promise<void> {
    const [popup] = await Promise.all([this.page.waitForEvent("popup"), this.submitButton.click()])

    await popup.click("#acc_0")
    await popup.click("#acc_1")
    await popup.click("#approve")
    await popup.close()
  }
}
