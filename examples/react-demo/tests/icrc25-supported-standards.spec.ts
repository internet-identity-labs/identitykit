import { expect } from "@playwright/test"
import { test as base } from "@playwright/test"
import { DemoPage } from "./page/demo.page"
import { Icrc25SupportedStandardsSection } from "./section/icrc25-supported-standards.section"

type Fixtures = {
  section: Icrc25SupportedStandardsSection
  demoPage: DemoPage
}

const test = base.extend<Fixtures>({
  section: async ({ page }, use) => {
    const section = new Icrc25SupportedStandardsSection(page)
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
})

test.skip("should check request and response has correct initial state", async ({ section }) => {
  const request = {
    method: "icrc25_supported_standards",
  }

  const initialRequest = await section.getRequestJson()
  expect(initialRequest).toStrictEqual(request)

  const initialResponse = await section.getResponseJson()
  expect(initialResponse).toStrictEqual({})
})

test.skip("should return list of supported standards", async ({ section }) => {
  const response = [
    {
      name: "ICRC-25",
      url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-25/ICRC-25.md",
    },
    {
      name: "ICRC-27",
      url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-27/ICRC-27.md",
    },
    {
      name: "ICRC-29",
      url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-29/ICRC-29.md",
    },
    {
      name: "ICRC-34",
      url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-34/ICRC-34.md",
    },
    {
      name: "ICRC-49",
      url: "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-49/ICRC-49.md",
    },
  ]

  await section.clickSubmitButton()
  await section.waitForResponse()

  const actualResponse = await section.getResponseJson()
  expect(actualResponse).toStrictEqual(response)
})
