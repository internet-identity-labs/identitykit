import { Page } from "@playwright/test"
import { Section } from "./section"

export class Icrc25RequestPermissionsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc25_request_permissions")
  }

  async approvePermissions(): Promise<void> {
    const [popup] = await Promise.all([this.page.waitForEvent("popup"), this.submitButton.click()])

    await popup.click("#approve")
    await popup.close()
  }
}
