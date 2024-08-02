import { expect, Locator, test as base } from "@playwright/test"
import { DemoPage } from "./page/demo.page"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section"
import { Icrc25PermissionsSection } from "./section/icrc25-permissions.section"

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
        method: "icrc25_permissions",
      }

      const initialRequest = await section.getRequestJson()
      expect(initialRequest).toStrictEqual(request)

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
      await requestPermissionSection.approvePermissions()
      const response = [
        {
          scope: {
            method: "icrc27_accounts",
          },
          state: "granted",
        },
        {
          scope: {
            method: "icrc34_delegation",
          },
          state: "granted",
        },
        {
          scope: {
            method: "icrc49_call_canister",
          },
          state: "granted",
        },
      ]
      const response2 = [
        {
          method: "icrc27_accounts",
        },
        {
          method: "icrc34_delegation",
        },
        {
          method: "icrc49_call_canister",
        },
      ]
      await section.clickSubmitButton()
      await section.waitForResponse()

      const actualResponse = await section.getResponseJson()
      expect(actualResponse).toStrictEqual(
        account.toString() == "locator('#signer_MockedSigner')" ? response : response2
      )
      await demoPage.logout()
    }
  })
})
