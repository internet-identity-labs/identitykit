import { expect, Locator, test as base } from "@playwright/test"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section"
import { DemoPage } from "./page/demo.page"

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
        method: "icrc25_request_permissions",
        params: {
          scopes: [
            {
              method: "icrc27_accounts",
            },
            {
              method: "icrc34_delegation",
            },
            {
              method: "icrc49_call_canister",
            },
          ],
        },
      }

      const initialRequest = await section.getRequestJson()
      expect(initialRequest).toStrictEqual(request)

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    }
  })

  test("should request full list of permissions", async ({ section, demoPage }) => {
    for (const account of accounts) {
      await demoPage.login(account)
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

      await section.approvePermissions(account)
      await section.clickSubmitButton()
      const actualResponse = await section.getResponseJson()
      expect(actualResponse).toStrictEqual(
        account.toString() == "locator('#signer_MockedSigner')" ? response : response2
      )
      await demoPage.logout()
    }
  })
})
