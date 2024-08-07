import { expect, Page, test as base } from "@playwright/test"
import { Account, AccountType, DemoPage } from "./page/demo.page.ts"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section.ts"
import { Icrc25AccountsSection } from "./section/icrc27-accounts.section.ts"
import { ExpectedTexts } from "./section/expectedTexts.ts"

type Fixtures = {
  section: Icrc25AccountsSection
  demoPage: DemoPage
  requestPermissionSection: Icrc25RequestPermissionsSection
  nfidPage: Page
}

const test = base.extend<Fixtures>({
  section: async ({ page }, use) => {
    const section = new Icrc25AccountsSection(page)
    await use(section)
  },
  demoPage: async ({ page }, use) => {
    const demoPage = new DemoPage(page)
    await demoPage.goto()
    await use(demoPage)
  },
  nfidPage: async ({ context, demoPage }, use) => {
    const nfidPage = await context.newPage()
    await nfidPage.goto("https://dev.nfid.one/")
    await demoPage.setAccount(10974, nfidPage)
    await context.pages()[0].bringToFront()
    await use(nfidPage)
    await nfidPage.close()
  },
  requestPermissionSection: async ({ page }, use) => {
    const requestPermissionSection = new Icrc25RequestPermissionsSection(page)
    await use(requestPermissionSection)
  },
})

test.describe("ICRC25 accounts", () => {
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
      expect(initialRequest).toStrictEqual({ method: "icrc27_accounts" })

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    }
  })

  test("should return list of accounts", async ({
    section,
    demoPage,
    requestPermissionSection,
    nfidPage,
    context,
  }) => {
    for (const account of accounts) {
      await demoPage.login(account)
      await requestPermissionSection.approvePermissions(account)

      account.type === AccountType.MockedSigner
        ? await section.selectAccountsMocked()
        : await section.selectAccountsNFID(demoPage.page, context, 30000)

      await section.waitForResponse()
      const actualResponse = await section.getResponseJson()
      expect(actualResponse).toStrictEqual(
        account.type === AccountType.MockedSigner
          ? ExpectedTexts.Mocked.ListOfAccountsResponse
          : ExpectedTexts.NFID.ListOfAccountsResponse
      )
      await demoPage.logout()
    }
  })
})
