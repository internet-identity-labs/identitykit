import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"
import { Page } from "@playwright/test"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function waitForLoaderDisappear(page: Page) {
  await page.locator("#loader").waitFor({ state: "visible" })
  await page.locator("#loader").waitFor({ state: "detached" })
}

export async function waitForDataCacheLoading(page: Page, timeout: number = 10000) {
  let rootDisplayed = false
  const checkRootDisplayed = async () => {
    while (!rootDisplayed) {
      if ((await page.locator("#root").getAttribute("data-cache-loaded")) === "true") {
        rootDisplayed = true
      }
    }
  }
  await Promise.race([
    checkRootDisplayed(),
    new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout waiting for data cache to load")), timeout)
    ),
  ])
}

export function readFile(filename: string): any {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, filename), "utf8"))
  } catch (err) {
    throw new Error(`cannot read file: ${err}`)
  }
}

export async function expectTrue(a: Promise<boolean> | boolean, message?: string) {
  if (!(await a)) throw new Error(message || `Failed comparison`)
}
