import { expect } from "@playwright/test"
import { test as base } from "@playwright/test"
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
  demoPage: [
    async ({ page }, use) => {
      const demoPage = new DemoPage(page)
      await demoPage.goto()
      await demoPage.login()
      await use(demoPage)
    },
    { auto: true },
  ],
  requestPermissionSection: [
    async ({ page }, use) => {
      const requestPermissionSection = new Icrc25RequestPermissionsSection(page)
      await requestPermissionSection.approvePermissions()
      await use(requestPermissionSection)
    },
    { auto: true },
  ],
})

test.skip("should check request and response has correct initial state", async ({ section }) => {
  const request = {
    method: "icrc27_accounts",
  }

  const initialRequest = await section.getRequestJson()
  expect(initialRequest).toStrictEqual(request)

  const initialResponse = await section.getResponseJson()
  expect(initialResponse).toStrictEqual({})
})

test.skip("should return list of accounts", async ({ section }) => {
  const response = [
    {
      owner: "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
      subaccount: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
    },
    {
      owner: "6pfju-rc52z-aihtt-ahhg6-z2bzc-ofp5r-igp5i-qy5ep-j6vob-gs3ae-nae",
      subaccount: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE=",
    },
  ]

  await section.selectAccounts()
  await section.waitForResponse()

  const actualResponse = await section.getResponseJson()
  expect(actualResponse).toStrictEqual(response)
})
