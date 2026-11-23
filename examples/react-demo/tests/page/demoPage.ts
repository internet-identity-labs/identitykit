import { BrowserContext, expect, Page } from "@playwright/test"
import { UserService } from "../../../shared/e2e/accounts-service.js"
import { ProfileSection } from "../section/profile.section.js"
import { ExpectedTexts } from "../section/expectedTexts.js"
import { waitForPopup, waitUntil } from "../../../shared/e2e/helpers.js"
import { clickInSignerPopup } from "../../../shared/e2e/signer-popup.js"
import { MAX_WAIT_MS } from "../../../shared/e2e/config.js"

export class DemoPage {
  connectButton
  private disconnectButton

  constructor(public readonly page: Page) {
    this.connectButton = this.page.locator("#connect")
    this.disconnectButton = this.page.locator(".ik-disconnect")
  }

  get changeThemeButton() {
    return this.page.locator("#changeTheme")
  }

  get userBalance() {
    return this.page.locator("#connect div small")
  }

  /** Displayed ICP balance; waits (up to 30 s) until the dapp has rendered a number. */
  async getIcpBalance(): Promise<number> {
    let balance = NaN
    await waitUntil(
      async () => {
        const [text] = await this.userBalance.allTextContents()
        balance = parseFloat((text ?? "").replace(" ICP", ""))
        return Number.isFinite(balance)
      },
      { timeout: MAX_WAIT_MS, timeoutMsg: "ICP balance wasn't displayed" }
    )
    return balance
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
    await waitForPopup(
      context,
      async () => await this.page.locator(account.locator).click({ timeout: 5000 })
    )
    const popup = context.pages()[context.pages().length - 1]
    await popup!.bringToFront()
    await clickInSignerPopup(popup!, popup!.locator(`#profile_${accountProfile}`))
    await clickInSignerPopup(popup!, popup!.locator('//button[.//text()="Connect"]'))
    expect(JSON.parse(<string>await profileSection.getProfileInfo())).toMatchObject(
      method === "Delegation"
        ? accountProfile === "public"
          ? ExpectedTexts.General.Public.DelegationTabResponse
          : ExpectedTexts.General.Anonymous.DelegationTabResponse
        : accountProfile === "public"
          ? ExpectedTexts.General.Public.AccountsTabResponse
          : ExpectedTexts.General.Anonymous.AccountsTabResponse
    )
    await this.connectButton.waitFor({ state: "visible", timeout: 10000 })
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
    Anonymous: "legacy_0",
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
