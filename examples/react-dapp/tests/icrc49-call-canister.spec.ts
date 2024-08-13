import { expect, Page, test as base } from "@playwright/test"
import { Account, AccountType, DemoPage } from "./page/demo.page.ts"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section.ts"
import { Icrc49CallCanisterSection } from "./section/icrc49-call-canister.section.ts"
import { ExpectedTexts } from "./section/expectedTexts.ts"

type Fixtures = {
  section: Icrc49CallCanisterSection
  demoPage: DemoPage
  requestPermissionSection: Icrc25RequestPermissionsSection
  nfidPage: Page
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
  nfidPage: async ({ context, demoPage }, use) => {
    const nfidPage = await context.newPage()
    await nfidPage.goto("https://dev.nfid.one/")
    await demoPage.setAccount(10974, nfidPage)
    await context.pages()[0].bringToFront()
    await use(nfidPage)
    await nfidPage.close()
  },
})

test.describe("ICRC25 call-canister", () => {
  let accounts: Account[] = []

  test.beforeEach(async ({ page }) => {
    accounts = await DemoPage.getAccounts(page)
  })

  test("should check request and response has correct initial state for no consent case", async ({
    section,
    demoPage,
    requestPermissionSection,
  }) => {
    for (const account of accounts) {
      await section.loginAndApprovePermissions(demoPage, requestPermissionSection, account)
      await section.checkRequestResponse(
        section,
        ExpectedTexts.General.NoConsentCaseInitialCanisterCallState
      )
      await demoPage.logout()
    }
  })

  test("should check request and response has correct state for consent case", async ({
    section,
    demoPage,
    requestPermissionSection,
  }) => {
    for (const account of accounts) {
      await section.loginAndApprovePermissions(demoPage, requestPermissionSection, account)
      await section.selectConsentTab()
      await section.checkRequestResponse(
        section,
        ExpectedTexts.General.ConsentCaseInitialCanisterCallState
      )
      await demoPage.logout()
    }
  })

  test("should make canister call with no consent", async ({
    section,
    demoPage,
    requestPermissionSection,
    context,
    nfidPage,
  }) => {
    await nfidPage.title()
    const account = accounts[0]
    await section.loginAndApprovePermissions(demoPage, requestPermissionSection, account)
    if (account.type === AccountType.MockedSigner) {
      const popup = await section.openPopup()
      const texts = await section.getPopupTexts(popup)
      expect(texts).toEqual(ExpectedTexts.Mocked.NoConsentCaseCanisterCallRequest)
      await section.approve(popup)
    } else {
      await section.checkPopupTextNFID(
        demoPage.page,
        context,
        ExpectedTexts.NFID.NoConsentCaseCanisterCall
      )
    }

    await section.waitForResponse()
    const actualResponse = await section.getResponseJson()

    expect(actualResponse).toMatchObject(ExpectedTexts.Mocked.NoConsentCaseCanisterCallResponse)
    await demoPage.logout()
  })

  test("should make canister call with consent", async ({
    section,
    demoPage,
    requestPermissionSection,
    context,
    nfidPage,
  }) => {
    await nfidPage.title()
    const account = accounts[0]
    await section.loginAndApprovePermissions(demoPage, requestPermissionSection, account)
    if (account.type === AccountType.MockedSigner) {
      const popup = await section.openPopup()
      const texts = await section.getPopupTexts(popup)
      expect(texts).toEqual(ExpectedTexts.Mocked.ConsentCaseCanisterCallRequest)
      await section.approve(popup)
    } else {
      await section.checkPopupTextNFID(
        demoPage.page,
        context,
        ExpectedTexts.NFID.ConsentCaseCanisterCall
      )
    }

    await section.waitForResponse()
    const actualResponse = await section.getResponseJson()

    expect(actualResponse).toMatchObject(ExpectedTexts.Mocked.ConsentCaseCanisterCallResponse)
    await demoPage.logout()
  })
})
