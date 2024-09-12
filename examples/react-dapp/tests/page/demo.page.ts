import { Locator, Page } from "@playwright/test"
import { UserService } from "../helpers/accounts-service.ts"

export class DemoPage {
  private readonly connectButton: Locator
  private readonly disconnectButton: Locator

  constructor(public readonly page: Page) {
    this.connectButton = this.page.locator("#connect")
    this.disconnectButton = this.page.locator("#disconnect")
  }

  static async getAccounts(page): Promise<Account[]> {
    const mockedSignerButton: Account = {
      locator: page.locator("#signer_MockedSigner"),
      type: AccountType.MockedSigner,
    }
    const NFIDSignerButton: Account = {
      locator: page.locator("#signer_NFIDW"),
      type: AccountType.NFIDW,
    }
    return [mockedSignerButton, NFIDSignerButton]
  }

  async goto() {
    await this.page.goto("/")
  }

  async login(account: Account) {
    try {
      await this.connectButton.click({ timeout: 5000 })
      await account.locator.click({ timeout: 5000 })
    } catch (e) {
      await this.logout()
      throw new Error(`Login failed for user: ${account.type}`)
    }
  }

  async setAccount(anchor: number, page: Page) {
    const service = new UserService(page)
    await service.setAuth(anchor, page)
  }

  async logout() {
    await this.page.reload({ waitUntil: "load" })
  }
}

export interface Account {
  locator: Locator
  type: AccountType
}

export enum AccountType {
  MockedSigner = "MockedSigner",
  NFIDW = "NFIDW",
}

export enum ProfileType {
  Global = "Global",
  Session = "Session",
}

export default (page: Page) => new DemoPage(page)
