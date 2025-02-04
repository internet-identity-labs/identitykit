import { BrowserContext, expect, Page } from "@playwright/test"
import { UserService } from "../helpers/accounts-service.js"
import { ProfileSection } from "../section/profile.section.js"
import { ExpectedTexts } from "../section/expectedTexts.js"
import { waitForPopup, waitUntil } from "../helpers/helpers.js"

export class DemoPage {
  private connectButton
  private disconnectButton

  constructor(public readonly page: Page) {
    this.connectButton = this.page.locator("#connect")
    this.disconnectButton = this.page.locator(".ik-disconnect")
  }

  static getAccounts(): Account[] {
    return [
      // new Account("#signer_MockedSigner", AccountType.MockedSigner),
      new Account("#signer_NFIDW", AccountType.NFIDW),
    ]
  }

  async goto() {
    await this.page.goto("/")
  }

  async login(
    context: BrowserContext,
    account: Account,
    accountProfile: string,
    profileSection: ProfileSection,
    method: string
  ) {
    await profileSection.selectLoginMethod(method).click()
    await this.connectButton.click({ timeout: 5000 })
    await waitForPopup(context, async () =>
      this.page.locator(account.locator).click({ timeout: 5000 })
    )
    const popup = context.pages()[context.pages().length - 1]
    await popup!.bringToFront()
    await popup!.locator(`#profile_${accountProfile}`).click()
    await popup!.locator('//button[.//text()="Connect"]').click()
    await popup!.locator('//button[.//text()="Continue to app"]').click()
    expect(JSON.parse(<string>await profileSection.getProfileInfo())).toMatchObject(
      method === "Delegation"
        ? accountProfile === "public"
          ? ExpectedTexts.General.Public.DelegationTabResponse
          : ExpectedTexts.General.Anonymous.DelegationTabResponse
        : accountProfile === "public"
          ? ExpectedTexts.General.Public.AccountsTabResponse
          : ExpectedTexts.General.Anonymous.AccountsTabResponse
    )
  }

  async setAccount(anchor: number, page: Page) {
    const service = new UserService(page)
    await service.setAuth(anchor, page)
  }

  async logout() {
    await this.connectButton.click({ timeout: 5000 })
    await this.disconnectButton.click()
    await waitUntil(
      async () => {
        return (
          (await this.connectButton.textContent())?.replace(/\u00A0/g, " ").trim() ==
          "Connect wallet"
        )
      },
      { timeout: 10000, timeoutMsg: "User wasn't disconnected" }
    )
  }

  static loginMethods: {
    readonly delegation: "Delegation"
    readonly accounts: "Accounts"
  } = {
    delegation: "Delegation",
    accounts: "Accounts",
  } as const

  static profileType = {
    Public: "public",
    // Anonymous: "legacy_0",
  }
}

export class Account {
  locator: string
  type: AccountType

  constructor(id: string, type: AccountType) {
    this.locator = id
    this.type = type
  }
}

export enum AccountType {
  MockedSigner = "MockedSigner",
  NFIDW = "NFIDW",
}

export default (page: Page) => new DemoPage(page)
