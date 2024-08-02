import { Page } from "@playwright/test"
import { Section } from "./section"

export class Icrc25RequestPermissionsSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc25_request_permissions")
  }

  async approvePermissions(): Promise<void> {
    const [popup] = await Promise.all([this.page.waitForEvent("popup"), this.submitButton.click()])
    let isPopupClosed = false
    popup.on("close", () => {
      isPopupClosed = true
    })
    while (!isPopupClosed) {
      try {
        await popup.waitForSelector("#approve", { state: "attached", timeout: 2000 })
        await popup.click("#approve")
        break
      } catch (error) {
        if (isPopupClosed) {
          break
        }
      }
    }
    if (!isPopupClosed) {
      await popup.waitForEvent("close")
    }
  }
}
