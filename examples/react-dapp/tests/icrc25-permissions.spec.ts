import { expect } from "@playwright/test"
import { test as base } from "./helpers/hooks.js"
import { Account, AccountType, StandardsPage } from "./page/standards.page.ts"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section.ts"
import { Icrc25PermissionsSection } from "./section/icrc25-permissions.section.ts"
import { ExpectedTexts } from "./section/expectedTexts.ts"
import { withRetries } from "./helpers/utils.js"

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

test.describe("ICRC25 Permissions", () => {
  let accounts: Account[] = []

  test.beforeEach(async ({ page }) => {
    accounts = await StandardsPage.getAccounts(page)
  })

  test("should check request and response has correct initial state for each user", async ({
    section,
    standardsPage,
  }) => {
    for (const account of accounts) {
      await test.step(`Check request and response for user: ${account.type}`, async () => {
        await withRetries(async () => {
          await standardsPage.login(account)

          const initialRequest = await section.getRequestJson()
          expect
            .soft(initialRequest, `Invalid initial request for ${account.type} user`)
            .toStrictEqual({ method: "icrc25_permissions" })

          const initialResponse = await section.getResponseJson()
          expect
            .soft(initialResponse, `Invalid initial response for ${account.type} user`)
            .toStrictEqual({})
        }, `Check request and response for user: ${account.type}`)
      })
    }
  })

  test("should retrieve empty permissions", async ({ section, standardsPage }) => {
    for (const account of accounts) {
      await test.step(`User: ${account.type}`, async () => {
        console.log(`Check retrieve full permissions for user: ${account.type}`)
        await withRetries(async () => {
          await standardsPage.login(account)

          await section.clickSubmitButton()

          const actualResponse = await section.getResponseJson()
          expect
            .soft(actualResponse, `Invalid empty response for ${account.type} user`)
            .toStrictEqual({})
          await standardsPage.logout()
        })
      })
    }
  })

  test("should retrieve full list of permissions", async ({
    section,
    requestPermissionSection,
    standardsPage,
  }) => {
    for (const account of accounts) {
      await test.step(`Check retrieve full permissions for user: ${account.type}`, async () => {
        await withRetries(async () => {
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
        }, `Check retrieve full permissions for user: ${account.type}`)
      })
    }
  })
})
