import { expect, test as base } from "@playwright/test"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section.ts"
import { AccountType, StandardsPage } from "./page/standards.page.ts"
import { ExpectedTexts } from "./section/expectedTexts.ts"

type Fixtures = {
  section: Icrc25RequestPermissionsSection
  demoPage: StandardsPage
}

const test = base.extend<Fixtures>({
  section: async ({ page }, use) => {
    const section = new Icrc25RequestPermissionsSection(page)
    await use(section)
  },
  demoPage: async ({ page }, use) => {
    const demoPage = new StandardsPage(page)
    await demoPage.goto()
    await use(demoPage)
  },
})

const accounts = await StandardsPage.getAccounts()
for (const account of accounts) {
  test.describe(`ICRC25 Request Permissions for ${account.type} user`, () => {
    test(`should check request and response has correct initial state for ${account.type} user`, async ({
      section,
      demoPage,
    }) => {
      await demoPage.login(account)
      const initialRequest = await section.getRequestJson()
      expect(initialRequest).toStrictEqual(ExpectedTexts.General.InitialPermissionsRequestState)

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    })

    test(`should request full list of permissions for ${account.type} user`, async ({
      section,
      demoPage,
    }) => {
      await demoPage.login(account)
      await section.approvePermissions(account)
      const actualResponse = await section.getResponseJson()
      expect(actualResponse).toStrictEqual(
        account.type === AccountType.MockedSigner
          ? ExpectedTexts.Mocked.GrantedPermissions
          : ExpectedTexts.NFID.GrantedPermissions
      )
      await demoPage.logout()
    })
  })
}
