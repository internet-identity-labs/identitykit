import { Locator, Page } from "@playwright/test"
import { waitUntil } from "../../../shared/e2e/helpers.js"
import { readCodeMirror } from "../../../shared/e2e/codemirror.js"
import { MAX_WAIT_MS } from "../../../shared/e2e/config.js"

export class ProfileSection {
  constructor(public readonly page: Page) {}

  get delegationMethodTabButton(): Locator {
    return this.page.locator("#delegationMethodTab")
  }

  get accountMethodTabButton(): Locator {
    return this.page.locator("#accountMethodTab")
  }

  get profileResponseSection(): Locator {
    return this.page.locator("#profile div.cm-content")
  }

  get connectErrorToast(): Locator {
    return this.page.locator(".Toastify__toast--error")
  }

  async getProfileInfo(): Promise<string> {
    await waitUntil(
      async () => {
        // Fail fast with the dapp's own error instead of waiting for the login state
        const connectErrors = await this.connectErrorToast.allTextContents()
        if (connectErrors.length) throw new Error(`Connect failed: ${connectErrors.join("; ")}`)
        // allTextContents() doesn't wait for the line to appear, so waitUntil's timeout applies
        const [text] = await this.profileResponseSection
          .locator(":scope > .cm-line:nth-child(3)")
          .allTextContents()
        return text !== undefined && text.trim() !== ""
      },
      { timeout: MAX_WAIT_MS, timeoutMsg: "Empty Profile Info" }
    )
    return readCodeMirror(this.profileResponseSection)
  }

  selectLoginMethod(method: string): Locator {
    return method == "Delegation" ? this.delegationMethodTabButton : this.accountMethodTabButton
  }
}
