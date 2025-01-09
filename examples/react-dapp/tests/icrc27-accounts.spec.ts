import { expect, Page, test as base } from "@playwright/test"
import { AccountType, StandardsPage } from "./page/standards.page.ts"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section.ts"
import { Icrc25AccountsSection } from "./section/icrc27-accounts.section.ts"
import { ExpectedTexts } from "./section/expectedTexts.ts"

type Fixtures = {
  section: Icrc25AccountsSection
  demoPage: StandardsPage
  requestPermissionSection: Icrc25RequestPermissionsSection
  nfidPage: Page
}

const test = base.extend<Fixtures>({
  section: async ({ page }, use) => {
    const section = new Icrc25AccountsSection(page)
    await use(section)
  },
  demoPage: async ({ page }, use) => {
    const demoPage = new StandardsPage(page)
    await demoPage.goto()
    await use(demoPage)
  },
  nfidPage: async ({ context, demoPage }, use) => {
    const nfidPage = await context.newPage()
    await nfidPage.goto("https://dev.nfid.one/")
    await demoPage.setAccount(10974, nfidPage)
    await context.pages()[0]!.bringToFront()
    await use(nfidPage)
  },
  requestPermissionSection: async ({ page }, use) => {
    const requestPermissionSection = new Icrc25RequestPermissionsSection(page)
    await use(requestPermissionSection)
  },
})

const accounts = await StandardsPage.getAccounts()
for (const account of accounts) {
  test.describe(`ICRC27 accounts for ${account.type} user`, () => {
    test(`should check request and response has correct initial state for ${account.type} user`, async ({
      section,
      demoPage,
    }) => {
      await demoPage.login(account)

      const initialRequest = await section.getRequestJson()
      expect(initialRequest).toStrictEqual({ method: "icrc27_accounts" })

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    })

    test(`should return list of accounts for ${account.type} user`, async ({
      section,
      demoPage,
      requestPermissionSection,
      nfidPage,
      context,
    }) => {
      await nfidPage.title()
      await demoPage.login(account)
      await requestPermissionSection.approvePermissions(account)

      if (account.type === AccountType.MockedSigner) await section.selectAccountsMocked(context)
      else await section.selectAccountsNFID(demoPage.page, context)

      await section.waitForResponse()
      const actualResponse = await section.getResponseJson()
      expect(actualResponse).toStrictEqual(
        account.type === AccountType.MockedSigner
          ? ExpectedTexts.Mocked.ListOfAccountsResponse
          : ExpectedTexts.NFID.ListOfAccountsResponse
      )
      await demoPage.logout()
      await nfidPage.close()
    })
  })
}
