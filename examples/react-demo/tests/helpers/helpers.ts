import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"
import { Page } from "@playwright/test"
import { TestUser } from "../types.ts"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function waitForLoaderDisappear(page: Page) {
  await page.locator("#loader").waitFor({ state: "detached" })
}

export function readFile(filename: string): TestUser[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, filename), "utf8"))
  } catch (err) {
    throw new Error(`cannot read file: ${err}`)
  }
}

export async function expectTrue(a: Promise<boolean> | boolean, message?: string) {
  if (!(await a)) throw new Error(message || `Failed comparison`)
}

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
