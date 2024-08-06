import { Locator, Page } from "@playwright/test"
import { UserService } from "../helpers/accounts-service.js"

export class DemoPage {
  private readonly connectButton: Locator
  private readonly disconnectButton: Locator

  constructor(public readonly page: Page) {
    this.connectButton = this.page.locator("#connect")
    this.disconnectButton = this.page.locator("#disconnect")
  }

  static async getAccounts(page): Promise<Locator[]> {
    const mockedSignerButton = page.locator("#signer_MockedSigner")
    const NFIDSignerButton = page.locator("#signer_NFID")
    return [mockedSignerButton, NFIDSignerButton]
  }

  async goto() {
    await this.page.goto("/")
  }

  async login(account: Locator) {
    await this.connectButton.click()
    await account.click()
  }

  async setAccount(anchor: number, page: Page) {
    const service = new UserService(page)
    await service.setAuth(anchor, page)
  }

  async logout() {
    //TODO replace refreshing of a page with commented steps when dapp is ready
    // await this.connectButton.click()
    // await this.disconnectButton.click()
    await this.page.reload({ waitUntil: "load" })
  }
}

export default (page: Page) => new DemoPage(page)
