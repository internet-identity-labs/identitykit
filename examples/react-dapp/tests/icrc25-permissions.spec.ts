import { expect, test as base } from "@playwright/test"
import { Account, AccountType, DemoPage } from "./page/demo.page.ts"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section.ts"
import { Icrc25PermissionsSection } from "./section/icrc25-permissions.section.ts"
import { ExpectedTexts } from "./section/expectedTexts.ts"

type Fixtures = {
  section: Icrc25PermissionsSection
  demoPage: DemoPage
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
  demoPage: async ({ page }, use) => {
    const demoPage = new DemoPage(page)
    await demoPage.goto()
    await use(demoPage)
  },
})

test.describe("ICRC25 Permissions", () => {
  let accounts: Account[] = []

  test.beforeEach(async ({ page }) => {
    accounts = await DemoPage.getAccounts(page)
  })

  test("should check request and response has correct initial state", async ({
    section,
    demoPage,
  }) => {
    for (const account of accounts) {
      await demoPage.login(account)

      const initialRequest = await section.getRequestJson()
      expect(initialRequest).toStrictEqual({ method: "icrc25_permissions" })

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    }
  })

  test("should retrieve empty permissions", async ({ section, demoPage }) => {
    for (const account of accounts) {
      await demoPage.login(account)
      await section.clickSubmitButton()

      const actualResponse = await section.getResponseJson()
      expect(actualResponse).toStrictEqual({})
      await demoPage.logout()
    }
  })

  test("should retrieve full list of permissions", async ({
    section,
    requestPermissionSection,
    demoPage,
  }) => {
    for (const account of accounts) {
      await demoPage.login(account)
      await requestPermissionSection.approvePermissions(account)
      await section.clickSubmitButton()
      await section.waitForResponse()

      const actualResponse = await section.getResponseJson()
      expect(actualResponse).toStrictEqual(
        account.type === AccountType.MockedSigner
          ? ExpectedTexts.Mocked.FullPermissionsList
          : ExpectedTexts.NFID.FullPermissionsList
      )
      await demoPage.logout()
    }
  })
})
