import { expect } from "@playwright/test"
import { test as base } from "@playwright/test"
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
    const demoPage = new Icrc25PermissionsSection(page)
    await use(demoPage)
  },
  requestPermissionSection: async ({ page }, use) => {
    const requestPermissionSection = new Icrc25RequestPermissionsSection(page)
    await use(requestPermissionSection)
  },
  demoPage: [
    async ({ page }, use) => {
      const demoPage = new DemoPage(page)
      await demoPage.goto()
      await demoPage.login()
      await use(demoPage)
    },
    { auto: true },
  ],
})

test("should check request and response has correct initial state", async ({ section }) => {
  const request = {
    method: "icrc25_permissions",
  }

  const initialRequest = await section.getRequestJson()
  expect(initialRequest).toStrictEqual(request)

  const initialResponse = await section.getResponseJson()
  expect(initialResponse).toStrictEqual({})
})

test("should retrieve empty permissions", async ({ section }) => {
  await section.clickSubmitButton()

  const actualResponse = await section.getResponseJson()
  expect(actualResponse).toStrictEqual({})
})

test("should retrieve full list of permissions", async ({ section, requestPermissionSection }) => {
  const response = [
    { method: "icrc27_accounts" },
    { method: "icrc34_delegation" },
    { method: "icrc49_call_canister" },
  ]

  await requestPermissionSection.approvePermissions()
  await section.clickSubmitButton()
  await section.waitForResponse()

  const actualResponse = await section.getResponseJson()
  expect(actualResponse).toStrictEqual(response)
})
