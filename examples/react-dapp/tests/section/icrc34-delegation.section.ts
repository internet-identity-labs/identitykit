import { Locator, Page } from "@playwright/test"
import { Section } from "./section"

export class Icrc34DelegationSection extends Section {
  constructor(public readonly page: Page) {
    super(page, "icrc34_delegation")
  }

  async openPopup(): Promise<Page> {
    const [popup] = await Promise.all([this.page.waitForEvent("popup"), this.submitButton.click()])

    return popup
  }

  async isDisabledGlobalAccount(popup: Page): Promise<boolean> {
    return await popup.locator("#acc_1").isDisabled()
  }

  async isDisabledSessionAccount(popup: Page): Promise<boolean> {
    return await popup.locator("#acc_2").isDisabled()
  }

  async selectGlobalAccount(popup: Page): Promise<void> {
    await popup.click("#acc_1")
    await popup.click("#approve")
    await popup.close()
  }

  async selectSessionAccount(popup: Page): Promise<void> {
    await popup.click("#acc_2")
    await popup.click("#approve")
    await popup.close()
  }

  async setRequestWithNoTargets(): Promise<void> {
    await this.page.evaluate(() => {
      const element = document.querySelector(
        `#icrc34_delegation #request-section div.cm-line:nth-child(6) > span`
      )
      if (element) element.textContent = ""
    })
  }
}
