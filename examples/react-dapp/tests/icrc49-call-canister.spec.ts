import { expect, Locator, test as base } from "@playwright/test"
import { DemoPage } from "./page/demo.page"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section"
import { Icrc49CallCanisterSection } from "./section/icrc49-call-canister.section"

type Fixtures = {
  section: Icrc49CallCanisterSection
  demoPage: DemoPage
  requestPermissionSection: Icrc25RequestPermissionsSection
}

const test = base.extend<Fixtures>({
  section: async ({ page }, use) => {
    const section = new Icrc49CallCanisterSection(page)
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

test.describe("ICRC25 call-canister", () => {
  let accounts: Locator[] = []

  test.beforeEach(async ({ page }) => {
    accounts = await DemoPage.getAccounts(page)
  })
  test("should check request and response has correct initial state", async ({
    section,
    demoPage,
    requestPermissionSection,
  }) => {
    for (const account of accounts) {
      await demoPage.login(account)
      await requestPermissionSection.approvePermissions()
      const request = {
        method: "icrc49_call_canister",
        params: {
          canisterId: "do25a-dyaaa-aaaak-qifua-cai",
          sender: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
          method: "greet_no_consent",
          arg: "RElETAABcQJtZQ==",
        },
      }

      const initialRequest = await section.getRequestJson()
      expect(initialRequest).toStrictEqual(request)

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    }
  })

  test("should check request and response has correct state for consent case", async ({
    section,
    demoPage,
    requestPermissionSection,
  }) => {
    for (const account of accounts) {
      await demoPage.login(account)
      await requestPermissionSection.approvePermissions()
      const request = {
        method: "icrc49_call_canister",
        params: {
          canisterId: "do25a-dyaaa-aaaak-qifua-cai",
          sender: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
          method: "greet",
          arg: "RElETAABcQJtZQ==",
        },
      }

      await section.selectConsentTab()

      const initialRequest = await section.getRequestJson()
      expect(initialRequest).toStrictEqual(request)

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    }
  })

  test("should make canister call with no consent", async ({
    section,
    demoPage,
    requestPermissionSection,
  }) => {
    for (const account of accounts) {
      await demoPage.login(account)
      await requestPermissionSection.approvePermissions()
      const popup = await section.openPopup()

      const textsExpected = [
        "Request from http://localhost:3001",
        "Canister ID",
        "do25a-dyaaa-aaaak-qifua-cai",
        "Sender",
        "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
        "Arguments",
        '["me"]',
      ]

      const texts = await section.getPopupTexts(popup)

      expect(texts).toEqual(textsExpected)

      await section.approve(popup)
      await section.waitForResponse()
      const actualResponse = await section.getResponseJson()

      expect(actualResponse).toMatchObject({
        origin: "http://localhost:3001",
        jsonrpc: "2.0",
        id: "7812362e-29b8-4099-824c-067e8a50f6f3",
        result: {
          contentMap: expect.anything(),
          certificate: expect.anything(),
          content: "Hello, me!",
        },
      })
      await demoPage.logout()
    }
  })

  test("should make canister call with consent", async ({
    section,
    demoPage,
    requestPermissionSection,
  }) => {
    for (const account of accounts) {
      await demoPage.login(account)
      await requestPermissionSection.approvePermissions()
      await section.selectConsentTab()

      const popup = await section.openPopup()

      const textsExpected = [
        "Request from http://localhost:3001",
        "Canister ID",
        "do25a-dyaaa-aaaak-qifua-cai",
        "Sender",
        "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
        "Arguments",
        '["me"]',
        "Produce the following greeting text: > Hello, me!",
      ]

      const texts = await section.getPopupTexts(popup)

      expect(texts).toEqual(textsExpected)

      await section.approve(popup)
      await section.waitForResponse()
      const actualResponse = await section.getResponseJson()

      expect(actualResponse).toMatchObject({
        origin: "http://localhost:3001",
        jsonrpc: "2.0",
        id: "7812362e-29b8-4099-824c-067e8a50f6f3",
        result: {
          contentMap: expect.anything(),
          certificate: expect.anything(),
          content: "Hello, me!",
        },
      })
      await demoPage.logout()
    }
  })
})
