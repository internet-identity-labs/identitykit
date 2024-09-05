import { expect, test as base } from "@playwright/test"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section.ts"
import { Account, AccountType, DemoPage } from "./page/demo.page.ts"
import { ExpectedTexts } from "./section/expectedTexts.ts"

type Fixtures = {
  section: Icrc25RequestPermissionsSection
  demoPage: DemoPage
}

const test = base.extend<Fixtures>({
  section: async ({ page }, use) => {
    const section = new Icrc25RequestPermissionsSection(page)
    await use(section)
  },
  demoPage: async ({ page }, use) => {
    const demoPage = new DemoPage(page)
    await demoPage.goto()
    await use(demoPage)
  },
})
test.describe("ICRC25 Request Permissions", () => {
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
      expect(initialRequest).toStrictEqual(ExpectedTexts.General.InitialPermissionsRequestState)

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    }
  })

  test("should request full list of permissions on Demo app", async ({ section, demoPage }) => {
    const account = accounts[0]
    await testFullPermissions(demoPage, section, account)
  })

  test("should request full list of permissions on NFID wallet", async ({ section, demoPage }) => {
    const account = accounts[1]
    await testFullPermissions(demoPage, section, account)
  })
})

async function testFullPermissions(
  demoPage: DemoPage,
  section: Icrc25RequestPermissionsSection,
  account: Account
) {
  await demoPage.login(account)
  await section.approvePermissions(account)
  await section.clickSubmitButton()
  const actualResponse = await section.getResponseJson()
  expect(actualResponse).toStrictEqual(
    account.type === AccountType.MockedSigner
      ? ExpectedTexts.Mocked.GrantedPermissions
      : ExpectedTexts.NFID.GrantedPermissions
  )
  await demoPage.logout()
}
