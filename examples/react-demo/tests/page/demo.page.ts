import { Locator, Page } from "@playwright/test"

export class DemoPage {
  private readonly connectButton: Locator
  private readonly mockedSignerButton: Locator

  constructor(public readonly page: Page) {
    this.connectButton = this.page.getByText("Connect wallet")
    this.mockedSignerButton = this.page.getByText("Mocked Signer Wallet")
  }

  async goto() {
    await this.page.goto("/")
  }

  async login() {
    await this.connectButton.click()
  }
}
