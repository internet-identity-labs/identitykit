import { Locator, Page } from "@playwright/test"
import { waitUntil } from "../helpers/helpers.js"

export class ProfileSection {
  constructor(public readonly page: Page) {}

  get delegationMethodTabButton(): Locator {
    return this.page.locator("#delegationMethodTab")
  }

  get accountMethodTabButton(): Locator {
    return this.page.locator("#accountMethodTab")
  }

  get profileResponseSection(): Locator {
    return this.page.locator("#profile div.cm-content")
  }

  async getProfileInfo(): Promise<null | string> {
    await waitUntil(
      async () => {
        const text = await this.profileResponseSection.locator("div:nth-child(3)").textContent()
        return text !== null && text.trim() !== ""
      },
      { timeout: 10000, timeoutMsg: "Empty Profile Info" }
    )
    return await this.profileResponseSection.textContent()
  }

  selectLoginMethod(method: string): Locator {
    return method == "Delegation" ? this.delegationMethodTabButton : this.accountMethodTabButton
  }
}
