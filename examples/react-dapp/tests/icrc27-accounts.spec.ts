import { expect, Locator, test as base } from "@playwright/test"
import { DemoPage } from "./page/demo.page"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section"
import { Icrc25AccountsSection } from "./section/icrc27-accounts.section"

type Fixtures = {
  section: Icrc25AccountsSection
  demoPage: DemoPage
  requestPermissionSection: Icrc25RequestPermissionsSection
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
  requestPermissionSection: async ({ page }, use) => {
    const requestPermissionSection = new Icrc25RequestPermissionsSection(page)
    await use(requestPermissionSection)
  },
})

test.describe("ICRC25 accounts", () => {
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
        method: "icrc27_accounts",
      }

      const initialRequest = await section.getRequestJson()
      expect(initialRequest).toStrictEqual(request)

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    }
  })

  test("should return list of accounts", async ({
    section,
    demoPage,
    requestPermissionSection,
  }) => {
    for (const account of accounts) {
      await demoPage.login(account)
      await requestPermissionSection.approvePermissions()
      const response = {
        accounts: [
          {
            owner: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
            subaccount: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
          },
          {
            owner: "6pfju-rc52z-aihtt-ahhg6-z2bzc-ofp5r-igp5i-qy5ep-j6vob-gs3ae-nae",
            subaccount: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE=",
          },
        ],
      }

      await section.selectAccounts()
      await section.waitForResponse()

      const actualResponse = await section.getResponseJson()
      expect(actualResponse).toStrictEqual(response)
      await demoPage.logout()
    }
  })
})
