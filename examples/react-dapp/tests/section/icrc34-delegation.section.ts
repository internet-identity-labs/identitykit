import { BrowserContext, expect, Locator, Page } from "@playwright/test"
import { Section } from "./section.js"
import { ProfileType } from "../page/standards.page.js"
import { waitForPopup } from "../helpers/helpers.js"

export class Icrc34DelegationSection extends Section {
  private popup: Page | undefined

  constructor(public readonly page: Page) {
    super(page, "icrc34_delegation")
  }

  popupNFID = {
    anonymousProfile: (): Locator => this.popup!.locator("#profile_legacy_0"),
    connectButton: (): Locator => this.popup!.locator("//button[.//text()='Connect']"),
    continueButton: (): Locator => this.popup!.locator("//button[.//text()='Continue to app']"),
  }

  popupMocked = {
    globalProfile: (): Locator => this.popup!.locator("#acc_1"),
    anonymousProfile: (): Locator => this.popup!.locator("#acc_2"),
    approveButton: (): Locator => this.popup!.locator("#approve"),
  }

  async openPopup(context: BrowserContext): Promise<Page> {
    await waitForPopup(context, async () => await this.submitButton.click())
    this.popup = context.pages()[context.pages().length - 1]
    await this.popup!.bringToFront()

    return this.popup!
  }

  async isDisabledGlobalAccount(popup: Page): Promise<boolean> {
    return await popup.locator("#acc_1").isDisabled()
  }

  async isDisabledSessionAccount(popup: Page): Promise<boolean> {
    return await popup.locator("#acc_2").isDisabled()
  }

  async selectProfileMocked(
    account: ProfileType,
    context: BrowserContext,
    checkGlobalAcc: (value: boolean) => void
  ): Promise<void> {
    const popup = await this.openPopup(context)
    const isDisabledGlobalAccount = await this.isDisabledGlobalAccount(popup)
    checkGlobalAcc(isDisabledGlobalAccount)
    const isDisabledSessionAccount = await this.isDisabledSessionAccount(popup)
    expect(isDisabledSessionAccount).toBeFalsy()
    if (account === ProfileType.Global) {
      await this.popupMocked.globalProfile().click()
    } else {
      await this.popupMocked.anonymousProfile().click()
    }
    await this.popupMocked.approveButton().click()
  }

  async selectProfileNFID(page: Page, profileType: string, context: BrowserContext): Promise<void> {
    await waitForPopup(context, async () => await this.submitButton.click())
    this.popup = context.pages()[context.pages().length - 1]
    await this.popup!.bringToFront()
    if (profileType == "anonymous") {
      await this.popupNFID.anonymousProfile().click()
    }
    await this.popupNFID.connectButton().click()
    await this.popupNFID.continueButton().click()
  }

  async setRequestWithNoTargets(): Promise<void> {
    await this.page.evaluate(() => {
      const element = document.querySelector(
        `#request-section-icrc34_delegation div.cm-line:nth-child(6) > span`
      )
      if (element) element.innerHTML = ""
    })
  }
}
