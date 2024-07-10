import { expect } from "@playwright/test"
import { test as base } from "@playwright/test"
import { DemoPage } from "./page/demo.page"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section"
import { Icrc34DelegationSection } from "./section/icrc34-delegation.section"

type Fixtures = {
  section: Icrc34DelegationSection
  demoPage: DemoPage
  requestPermissionSection: Icrc25RequestPermissionsSection
}

const test = base.extend<Fixtures>({
  section: async ({ page }, use) => {
    const section = new Icrc34DelegationSection(page)
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

test("should check request and response has correct initial state", async ({ section }) => {
  const request = {
    method: "icrc34_delegation",
    params: {
      publicKey: "MCowBQYDK2VwAyEAbK2m/DMYZ4FOpBH5IQnH0WX+L1+it1Yko204OSSQrVA=",
      targets: ["do25a-dyaaa-aaaak-qifua-cai"],
      maxTimeToLive: "28800000000000",
    },
  }

  const initialRequest = await section.getRequestJson()
  expect(initialRequest).toStrictEqual(request)

  const initialResponse = await section.getResponseJson()
  expect(initialResponse).toStrictEqual({})
})

test("should request global delegation with targets", async ({ section }) => {
  const popup = await section.openPopup()

  const isDisabledGlobalAccount = await section.isDisabledGlobalAccount(popup)
  expect(isDisabledGlobalAccount).toBeFalsy()

  const isDisabledSessionAccount = await section.isDisabledSessionAccount(popup)
  expect(isDisabledSessionAccount).toBeFalsy()

  await section.selectGlobalAccount(popup)

  await section.waitForResponse()

  const actualResponse = await section.getResponseJson()

  expect(actualResponse).toMatchObject({
    delegations: [
      {
        delegation: {
          expiration: expect.anything(),
          pubkey:
            "302a300506032b65700321006cada6fc331867814ea411f92109c7d165fe2f5fa2b75624a36d38392490ad50",
          targets: ["00000000015041680101"],
        },
        signature: expect.anything(),
      },
    ],
    publicKey:
      "302a300506032b65700321003b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
  })
})

test("should request session delegation with no targets", async ({ section }) => {
  await section.setRequestWithNoTargets()

  const popup = await section.openPopup()

  const isDisabledGlobalAccount = await section.isDisabledGlobalAccount(popup)
  expect(isDisabledGlobalAccount).toBeTruthy()

  const isDisabledSessionAccount = await section.isDisabledSessionAccount(popup)
  expect(isDisabledSessionAccount).toBeFalsy()

  await section.selectSessionAccount(popup)

  await section.waitForResponse()

  const actualResponse = await section.getResponseJson()

  expect(actualResponse).toMatchObject({
    delegations: [
      {
        delegation: {
          expiration: expect.anything(),
          pubkey:
            "302a300506032b65700321006cada6fc331867814ea411f92109c7d165fe2f5fa2b75624a36d38392490ad50",
        },
        signature: expect.anything(),
      },
    ],
    publicKey:
      "302a300506032b65700321003008adc857dfcd0477a7aaa01a657ca6923ce76c07645704b1e872deb1253baa",
  })
})
