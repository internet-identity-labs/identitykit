import { expect } from "@playwright/test"
import { test as base } from "@playwright/test"
import { DemoPage } from "./page/demo.page"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section"
import { Icrc49CallCanisterSection } from "./section/icrc49-call-canister.section"

type Fixtures = {
  section: Icrc49CallCanisterSection
  demoPage: DemoPage
  requestPermissionSection: Icrc25RequestPermissionsSection
}

const test = base.extend<Fixtures>({
  section: async ({ page }, apply) => {
    const section = new Icrc49CallCanisterSection(page)
    await apply(section)
  },
  demoPage: [
    async ({ page }, apply) => {
      const demoPage = new DemoPage(page)
      await demoPage.goto()
      await demoPage.login()
      await apply(demoPage)
    },
    { auto: true },
  ],
  requestPermissionSection: [
    async ({ page }, apply) => {
      const requestPermissionSection = new Icrc25RequestPermissionsSection(page)
      await requestPermissionSection.approvePermissions()
      await apply(requestPermissionSection)
    },
    { auto: true },
  ],
})

test.skip("should check request and response has correct initial state", async ({ section }) => {
  const request = {
    method: "icrc49_call_canister",
    params: {
      canisterId: "do25a-dyaaa-aaaak-qifua-cai",
      sender: "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
      method: "greet_no_consent",
      arg: "RElETAABcQJtZQ==",
    },
  }

  const initialRequest = await section.getRequestJson()
  expect(initialRequest).toStrictEqual(request)

  const initialResponse = await section.getResponseJson()
  expect(initialResponse).toStrictEqual({})
})

test.skip("should check request and response has correct state for consent case", async ({
  section,
}) => {
  const request = {
    method: "icrc49_call_canister",
    params: {
      canisterId: "do25a-dyaaa-aaaak-qifua-cai",
      sender: "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
      method: "greet",
      arg: "RElETAABcQJtZQ==",
    },
  }

  await section.selectConsentTab()

  const initialRequest = await section.getRequestJson()
  expect(initialRequest).toStrictEqual(request)

  const initialResponse = await section.getResponseJson()
  expect(initialResponse).toStrictEqual({})
})

test.skip("should make canister call with no consent", async ({ section }) => {
  const popup = await section.openPopup()

  const textsExpected = [
    "Request from http://localhost:3002",
    "Canister ID",
    "do25a-dyaaa-aaaak-qifua-cai",
    "Sender",
    "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
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
})

test.skip("should make canister call with consent", async ({ section }) => {
  await section.selectConsentTab()

  const popup = await section.openPopup()

  const textsExpected = [
    "Request from http://localhost:3002",
    "Canister ID",
    "do25a-dyaaa-aaaak-qifua-cai",
    "Sender",
    "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
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
})
