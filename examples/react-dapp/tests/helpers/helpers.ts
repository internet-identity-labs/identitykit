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
  options: WaitUntilOptions = {}
): Promise<void> {
  const { timeout = 20000, interval = 1000, message = "Timeout waiting for condition" } = options
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }
  throw new Error(message)
}

interface WaitUntilOptions {
  timeout?: number
  interval?: number
  message?: string
}
