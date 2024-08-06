import { BrowserContext, expect, Page } from "@playwright/test"
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

  async getPopupTextsNFID(popup: Page): Promise<string[]> {
    let text: string[] = []

    await popup.waitForSelector("div.flex.flex-col.flex-1.h-full p")
    const requestFromText = await popup
      .locator(".items-center.mt-10.text-sm.text-center a")
      .locator("..")
      .textContent()
    if (requestFromText) {
      text.push(requestFromText.trim())
    }
    text = text.concat(await popup.locator("div.flex.flex-col.flex-1.h-full p").allInnerTexts())
    return text
  }

  async approve(popup: Page): Promise<void> {
    await popup.click("#approve", { timeout: 50000 })
  }

  async checkPopupTextNFID(
    page: Page,
    context: BrowserContext,
    textsExpected: string[]
  ): Promise<void> {
    while (true) {
      try {
        await page.waitForTimeout(1000)
        if (!(await this.submitButton.isDisabled())) {
          await this.submitButton.click()
          await page.waitForEvent("popup", { timeout: 5000 })
        }
        await context
          .pages()[2]
          .locator('//button[.//text()="Try again"]')
          .waitFor({ state: "attached", timeout: 5000 })
        break
      } catch (e) {}
    }
    expect(await this.getPopupTextsNFID(await context.pages()[2])).toEqual(textsExpected)
    // await context.pages()[2].locator("//button[.//text()=\"Approve\"]").click()
    await context.pages()[2].close()
  }
}
