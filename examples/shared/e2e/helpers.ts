import { BrowserContext, Page } from "@playwright/test"
import { MAX_WAIT_MS } from "./config.js"

export async function waitForLoaderDisappear(page: Page) {
  await page.locator("#loader").waitFor({ state: "detached", timeout: MAX_WAIT_MS })
}

export async function expectTrue(a: Promise<boolean> | boolean, message?: string) {
  if (!(await a)) throw new Error(message || `Failed comparison`)
}

/**
 * Polls `condition` until it returns true. `condition` must not block on its own
 * (use non-waiting locator calls such as count()/allTextContents()), otherwise the
 * timeout below can't fire. A thrown error ends the wait immediately.
 */
export async function waitUntil(
  condition: () => Promise<boolean>,
  options?: number | { timeout?: number; interval?: number; timeoutMsg?: string },
  intervalOrMsg?: number | string,
  timeoutMsg?: string
): Promise<void> {
  const defaultOptions = {
    timeout: 10000,
    interval: 300,
    timeoutMsg: "Timeout waiting for condition",
  }
  let timeout: number, interval: number, message: string

  if (typeof options === "number") {
    timeout = options
    interval = typeof intervalOrMsg === "number" ? intervalOrMsg : defaultOptions.interval
    message =
      typeof intervalOrMsg === "string" ? intervalOrMsg : (timeoutMsg ?? defaultOptions.timeoutMsg)
  } else {
    timeout = options?.timeout ?? defaultOptions.timeout
    interval = options?.interval ?? defaultOptions.interval
    message = options?.timeoutMsg ?? defaultOptions.timeoutMsg
  }

  const startTime = Date.now()
  return new Promise((resolve, reject) => {
    const checkCondition = async () => {
      try {
        if (await condition()) return resolve()
        if (Date.now() - startTime >= timeout) return reject(new Error(message))
        setTimeout(checkCondition, interval)
      } catch (error) {
        reject(error)
      }
    }
    checkCondition()
  })
}

export async function waitForPopup(context: BrowserContext, action: () => Promise<void>) {
  const currentPages = context.pages().length
  await action()
  await waitUntil(
    async () => {
      return currentPages < context.pages().length
    },
    { interval: 500, timeout: 10000, timeoutMsg: "A new tab wasn't opened" }
  )
}
