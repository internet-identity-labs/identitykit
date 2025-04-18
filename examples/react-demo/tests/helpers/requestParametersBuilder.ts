import { Page } from "@playwright/test"

export class RequestParametersBuilder {
  private tokenID: string | undefined
  private amount: string | undefined
  private toPrincipal: string | undefined

  constructor(
    private page: Page,
    private method: () => string
  ) {}

  get canisterID_field() {
    return this.page.locator(`#${this.method()}_args #canister_id`)
  }

  get amount_field() {
    return this.page.locator(`#${this.method()}_args #amount`)
  }

  get toPrincipal_field() {
    return this.page.locator(`#${this.method()}_args #to_principal`)
  }

  setAmount(amount: string) {
    this.amount = amount
    return this
  }

  setTokenID(token: string) {
    this.tokenID = token
    return this
  }

  async setToPrincipal(principal: string) {
    const selfAddress = this.page.locator(
      `//div[@id="${this.method()}"]//div[@id="request-section"]//div[contains(., 'sender')]/span`
    )
    if (principal != "themselves") this.toPrincipal = principal
    else this.toPrincipal = (await selfAddress.innerText({ timeout: 10000 })).replace(/"/g, "")
    return this
  }

  async apply() {
    if (this.tokenID) {
      await this.canisterID_field.fill(this.tokenID)
    }
    if (this.amount) {
      await this.amount_field.fill(this.amount)
    }
    if (this.toPrincipal) {
      await this.toPrincipal_field.fill(this.toPrincipal)
    }
  }
}
