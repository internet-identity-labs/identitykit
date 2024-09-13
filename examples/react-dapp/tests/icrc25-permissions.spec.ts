import { expect } from "@playwright/test"
import { test as base } from "./helpers/hooks.js"
import { AccountType, StandardsPage } from "./page/standards.page.ts"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section.ts"
import { Icrc25PermissionsSection } from "./section/icrc25-permissions.section.ts"
import { ExpectedTexts } from "./section/expectedTexts.ts"

type Fixtures = {
  section: Icrc25PermissionsSection
  standardsPage: StandardsPage
  requestPermissionSection: Icrc25RequestPermissionsSection
}

const test = base.extend<Fixtures>({
  section: async ({ page }, use) => {
    const section = new Icrc25PermissionsSection(page)
    await use(section)
  },
  requestPermissionSection: async ({ page }, use) => {
    const requestPermissionSection = new Icrc25RequestPermissionsSection(page)
    await use(requestPermissionSection)
  },
  standardsPage: async ({ page }, use) => {
    const standardsPage = new StandardsPage(page)
    await standardsPage.goto()
    await use(standardsPage)
  },
})

const accounts = await StandardsPage.getAccounts()
for (const account of accounts) {
  test.describe(`ICRC25 Permissions for ${account.type} user`, () => {
    test(`should check request and response has correct initial state for ${account.type} user`, async ({
      section,
      standardsPage,
    }) => {
      await standardsPage.login(account)
      const initialRequest = await section.getRequestJson()
      expect
        .soft(initialRequest, `Invalid initial request for ${account.type} user`)
        .toStrictEqual({ method: "icrc25_permissions" })

      const initialResponse = await section.getResponseJson()
      expect
        .soft(initialResponse, `Invalid initial response for ${account.type} user`)
        .toStrictEqual({})
    })

    test(`${account.type} should retrieve empty permissions`, async ({
      section,
      standardsPage,
    }) => {
      await standardsPage.login(account)

      await section.clickSubmitButton()

      const actualResponse = await section.getResponseJson()
      expect
        .soft(actualResponse, `Invalid empty response for ${account.type} user`)
        .toStrictEqual({})
      await standardsPage.logout()
    })

    test(`${account.type} should retrieve full list of permissions`, async ({
      section,
      requestPermissionSection,
      standardsPage,
    }) => {
      await standardsPage.login(account)

      await requestPermissionSection.approvePermissions(account)
      await section.clickSubmitButton()
      await section.waitForResponse()
      await standardsPage.logout()
      const responseJson = await section.getResponseJson()
      await standardsPage.logout()

      expect
        .soft(responseJson, `Full list of permissions is Invalid for ${account.type} user`)
        .toStrictEqual(
          account.type === AccountType.MockedSigner
            ? ExpectedTexts.Mocked.GetCurrentPermissionsResponse
            : ExpectedTexts.NFID.GetCurrentPermissionsResponse
        )
      await standardsPage.logout()
    })
  })
}
