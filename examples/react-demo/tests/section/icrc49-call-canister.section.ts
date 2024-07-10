import { Page } from "@playwright/test"
import { Section } from "./section"

export class Icrc49CallCanisterSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc49_call_canister")
  }

  async openPopup(): Promise<Page> {
    const [popup] = await Promise.all([this.page.waitForEvent("popup"), this.submitButton.click()])

    return popup
  }

  async selectConsentTab(): Promise<void> {
    await this.page.locator("#select-request").click()
    await this.page.locator(`#dropdown-options label:nth-child(2)`).click()
  }

  async getPopupTexts(popup: Page): Promise<string[]> {
    await popup.waitForSelector(`div > small`)

    return await popup.locator(`div > small`).allInnerTexts()
  }

  async approve(popup: Page): Promise<void> {
    await popup.click("#approve", { timeout: 50000 })
  }
}
