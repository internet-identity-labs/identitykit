import { expect, Page, test as base } from "@playwright/test"
import { AccountType, StandardsPage } from "./page/standards.page.js"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section.js"
import { Icrc25AccountsSection } from "./section/icrc27-accounts.section.js"
import { ExpectedTexts } from "./section/expectedTexts.js"

type Fixtures = {
  section: Icrc25AccountsSection
  demoPage: StandardsPage
  requestPermissionSection: Icrc25RequestPermissionsSection
  nfidPage: Page
}

const test = base.extend<Fixtures>({
  section: async ({ page }, apply) => {
    const section = new Icrc25AccountsSection(page)
    await apply(section)
  },
  demoPage: async ({ page }, apply) => {
    const demoPage = new StandardsPage(page)
    await demoPage.goto()
    await apply(demoPage)
  },
  nfidPage: async ({ context, demoPage }, apply) => {
    const nfidPage = await context.newPage()
    await nfidPage.goto("https://dev.nfid.one/")
    await demoPage.setAccount(10974, nfidPage)
    await context.pages()[0]!.bringToFront()
    await apply(nfidPage)
  },
  requestPermissionSection: async ({ page }, apply) => {
    const requestPermissionSection = new Icrc25RequestPermissionsSection(page)
    await apply(requestPermissionSection)
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
      await requestPermissionSection.approvePermissions(context, account)

      if (account.type === AccountType.MockedSigner) await section.selectAccountsMocked(context)
      else await section.selectAccountsNFID(context)

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
