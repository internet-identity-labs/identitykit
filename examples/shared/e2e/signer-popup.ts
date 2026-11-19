import { Locator, Page } from "@playwright/test"
import { MAX_WAIT_MS } from "./config.js"

// Errors the NFID signer popup shows instead of the expected screen/button.
const SIGNER_ERROR_PATTERN = /request failed|insufficient [^\n]* balance|something went wrong/i

/** Throws with the popup's own message if it shows a known signer error. */
export async function assertNoSignerError(popup: Page): Promise<void> {
  if (popup.isClosed()) return
  const text = await popup
    .locator("body")
    .innerText({ timeout: 1000 })
    .catch(() => "")
  if (!SIGNER_ERROR_PATTERN.test(text)) return
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  const index = lines.findIndex((l) => SIGNER_ERROR_PATTERN.test(l))
  throw new Error(`Signer popup shows an error: ${lines.slice(index, index + 2).join(" ")}`)
}

/**
 * Waits up to `timeout` for `target` in the signer popup and clicks it. Fails right away
 * when the popup shows a signer error (e.g. "Insufficient NFIDW balance") instead of
 * waiting for a button that will never become usable.
 */
export async function clickInSignerPopup(
  popup: Page,
  target: Locator,
  timeout = MAX_WAIT_MS
): Promise<void> {
  const deadline = Date.now() + timeout
  for (;;) {
    await assertNoSignerError(popup)
    if ((await target.isVisible()) && (await target.isEnabled())) {
      await target.click()
      return
    }
    if (Date.now() >= deadline)
      throw new Error(`Signer popup: ${target} wasn't clickable within ${timeout} ms`)
    await popup.waitForTimeout(300)
  }
}
