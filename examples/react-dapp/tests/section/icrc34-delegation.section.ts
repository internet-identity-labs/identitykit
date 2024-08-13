import { BrowserContext, expect, Page } from "@playwright/test"
import { Section } from "./section.ts"
import { ProfileType } from "../page/demo.page.ts"

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

  async selectProfileMocked(account: ProfileType, checkMethod: (value) => void): Promise<void> {
    const popup = await this.openPopup()
    const isDisabledGlobalAccount = await this.isDisabledGlobalAccount(popup)
    checkMethod(isDisabledGlobalAccount)
    const isDisabledSessionAccount = await this.isDisabledSessionAccount(popup)
    expect(isDisabledSessionAccount).toBeFalsy()
    account == ProfileType.Global ? await popup.click("#acc_1") : await popup.click("#acc_2")
    await popup.click("#approve")
    await popup.close()
  }

  async selectProfileNFID(page: Page, context: BrowserContext): Promise<void> {
    let popup
    let done = false
    while (!done) {
      try {
        await page.waitForTimeout(500)
        if (!(await this.submitButton.isDisabled())) {
          await this.submitButton.click()
          popup = await page.waitForEvent("popup", { timeout: 5000 })
        }
        await context.pages()[2].locator("#profile_legacy_0").click({ timeout: 5000 })
        await context.pages()[2].locator('//button[.//text()="Approve"]').click()
        await page.waitForTimeout(500)
        await popup.close()
      } catch (e) {
        /* empty */
      }
      await page.waitForTimeout(1000)
      if (
        (await page
          .locator(`#${this.section} #response-section div.cm-line > span:nth-child(2)`)
          .count()) > 0
      )
        done = true
    }
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
