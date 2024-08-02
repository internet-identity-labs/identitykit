import { expect, Locator, test as base } from "@playwright/test"
import { DemoPage } from "./page/demo.page"
import { Icrc25SupportedStandardsSection } from "./section/icrc25-supported-standards.section"

type Fixtures = {
  section: Icrc25SupportedStandardsSection
  demoPage: DemoPage
}

const test = base.extend<Fixtures>({
  section: async ({ page }, use) => {
    const section = new Icrc25SupportedStandardsSection(page)
    await use(section)
  },
  demoPage: async ({ page }, use) => {
    const demoPage = new DemoPage(page)
    await demoPage.goto()
    await use(demoPage)
  },
})

test.describe("ICRC25 Supported standards", () => {
  let accounts: Locator[] = []

  test.beforeEach(async ({ page }) => {
    accounts = await DemoPage.getAccounts(page)
  })
  test("should check request and response has correct initial state", async ({
    section,
    demoPage,
  }) => {
    for (const account of accounts) {
      await demoPage.login(account)
      const request = {
        method: "icrc25_supported_standards",
      }

      const initialRequest = await section.getRequestJson()
      expect(initialRequest).toStrictEqual(request)

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    }
  })

  test("should return list of supported standards", async ({ section, demoPage }) => {
    for (const account of accounts) {
      await demoPage.login(account)
      const response = [
        {
          name: "ICRC-25",
          url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-25/ICRC-25.md",
        },
        {
          name: "ICRC-27",
          url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-27/ICRC-27.md",
        },
        {
          name: "ICRC-28",
          url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-28/ICRC-28.md",
        },
        {
          name: "ICRC-29",
          url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-29/ICRC-29.md",
        },
        {
          name: "ICRC-34",
          url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-34/ICRC-34.md",
        },
        {
          name: "ICRC-49",
          url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-49/ICRC-49.md",
        },
      ]

      await section.clickSubmitButton()
      await section.waitForResponse()

      const actualResponse = await section.getResponseJson()
      expect(actualResponse).toStrictEqual(response)
      await demoPage.logout()
    }
  })
})
