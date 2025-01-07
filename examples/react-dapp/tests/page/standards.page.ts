import { Locator, Page } from "@playwright/test"
import { UserService } from "../helpers/accounts-service.ts"

export class StandardsPage {
  private readonly connectButton: Locator
  private readonly disconnectButton: Locator

  constructor(public readonly page: Page) {
    this.connectButton = this.page.locator("#connect")
    this.disconnectButton = this.page.locator("#disconnect")
  }

  static async getAccounts(): Promise<Account[]> {
    return [
      new Account("#signer_MockedSigner", AccountType.MockedSigner),
      new Account("#signer_NFIDW", AccountType.NFIDW),
    ]
  }

  async goto() {
    await this.page.goto("/")
  }

  async login(account: Account) {
    await this.connectButton.click({ timeout: 5000 })
    await this.page.locator(account.locator).click({ timeout: 5000 })
  }

  async setAccount(anchor: number, page: Page) {
    const service = new UserService(page)
    await service.setAuth(anchor, page)
  }

  async logout() {
    await this.page.reload({ waitUntil: "load" })
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

export enum ProfileType {
  Global = "Global",
  Session = "Session",
}

export default (page: Page) => new StandardsPage(page)
