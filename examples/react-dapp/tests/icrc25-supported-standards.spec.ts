import { expect, test as base } from "@playwright/test"
import { StandardsPage } from "./page/standards.page.js"
import { Icrc25SupportedStandardsSection } from "./section/icrc25-supported-standards.section.js"
import { ExpectedTexts } from "./section/expectedTexts.js"

type Fixtures = {
  section: Icrc25SupportedStandardsSection
  demoPage: StandardsPage
}

const test = base.extend<Fixtures>({
  section: async ({ page }, apply) => {
    const section = new Icrc25SupportedStandardsSection(page)
    await apply(section)
  },
  demoPage: async ({ page }, apply) => {
    const demoPage = new StandardsPage(page)
    await demoPage.goto()
    await apply(demoPage)
  },
})

const accounts = await StandardsPage.getAccounts()
for (const account of accounts) {
  test.describe(`ICRC25 Supported standards for ${account.type} user`, () => {
    test(`should check request and response has correct initial state for ${account.type} user`, async ({
      section,
      demoPage,
    }) => {
      await demoPage.login(account)

      const initialRequest = await section.getRequestJson()
      expect(initialRequest).toStrictEqual({ method: "icrc25_supported_standards" })

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    })

    test(`should return list of supported standards for ${account.type} user`, async ({
      section,
      demoPage,
    }) => {
      await demoPage.login(account)
      await section.clickSubmitButton()
      await section.waitForResponse()

      const actualResponse = await section.getResponseJson()
      expect(actualResponse).toStrictEqual(ExpectedTexts.General.ListOfSupportedStandards)
      await demoPage.logout()
    })
  })
}
