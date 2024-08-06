import { BrowserContext, Page } from "@playwright/test"
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
    await popup.waitForSelector("#acc_1")
    return await popup.locator("#acc_1").isDisabled()
  }

  async isDisabledSessionAccount(popup: Page): Promise<boolean> {
    await popup.waitForSelector("#acc_2")
    return await popup.locator("#acc_2").isDisabled()
  }

  async selectGlobalAccountMocked(popup: Page): Promise<void> {
    await popup.waitForSelector("#acc_1")
    await popup.click("#acc_1")
    await popup.click("#approve")
    await popup.close()
  }

  async selectGlobalAccountNFID(
    page: Page,
    context: BrowserContext,
    timeout: number
  ): Promise<void> {
    const section = this

    async function tryClickApprove(): Promise<void> {
      let popup
      while (true) {
        try {
          await page.waitForTimeout(1000)
          if (!(await section.submitButton.isDisabled())) {
            await section.submitButton.click()
            popup = await page.waitForEvent("popup", { timeout: 5000 })
          }
          if (popup)
            await context
              .pages()[2]
              .locator('//button[.//text()="Approve"]')
              .waitFor({ state: "attached", timeout: 5000 })
          await context.pages()[2].locator("#profile_public").click()
          await context.pages()[2].locator('//button[.//text()="Approve"]').click()
          await page.waitForTimeout(10000)
          await popup.close()
          break
        } catch (e) {}
      }
    }

    await Promise.race([
      tryClickApprove(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`The "Approve" button wasn't clicked after ${timeout} ms`)),
          timeout
        )
      ),
    ])
  }

  async selectSessionAccountMocked(popup: Page): Promise<void> {
    await popup.click("#acc_2")
    await popup.click("#approve")
    await popup.close()
  }

  async selectSessionAccountNFID(
    page: Page,
    context: BrowserContext,
    timeout: number
  ): Promise<void> {
    const section = this

    async function tryClickApprove(): Promise<void> {
      let popup
      while (true) {
        try {
          await page.waitForTimeout(1000)
          if (!(await section.submitButton.isDisabled())) {
            await section.submitButton.click()
            popup = await page.waitForEvent("popup", { timeout: 5000 })
          }
          if (popup)
            await context
              .pages()[2]
              .locator('//button[.//text()="Approve"]')
              .waitFor({ state: "attached", timeout: 5000 })
          await context.pages()[2].locator("#profile_legacy_0").click()
          await context.pages()[2].locator('//button[.//text()="Approve"]').click()
          await page.waitForTimeout(1000)
          await popup.close()
        } catch (e) {}
        await page.waitForTimeout(1000)
        if (
          (await page
            .locator(`#${section.section} #response-section div.cm-line > span:nth-child(2)`)
            .count()) > 0
        )
          break
      }
    }

    await Promise.race([
      tryClickApprove(),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`The "Approve" button wasn't clicked after ${timeout} ms`)),
          timeout
        )
      ),
    ])
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
