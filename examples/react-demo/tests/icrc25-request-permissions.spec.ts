import { expect } from "@playwright/test"
import { test as base } from "@playwright/test"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section"
import { DemoPage } from "./page/demo.page"

type Fixtures = {
  section: Icrc25RequestPermissionsSection
  demoPage: DemoPage
}

const test = base.extend<Fixtures>({
  section: async ({ page }, use) => {
    const demoPage = new Icrc25RequestPermissionsSection(page)
    await use(demoPage)
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

test.skip("should check request and response has correct initial state", async ({ section }) => {
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
})

test.skip("should request full list of permissions", async ({ section }) => {
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

  await section.approvePermissions()

  const actualResponse = await section.getResponseJson()
  expect(actualResponse).toStrictEqual(response)
})
