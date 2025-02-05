import { expect, Page, test as base } from "@playwright/test"
import { AccountType, StandardsPage } from "./page/standards.page.js"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section.js"
import { Icrc49CallCanisterSection } from "./section/icrc49-call-canister.section.js"
import { ExpectedTexts } from "./section/expectedTexts.js"
import { Icrc25AccountsSection } from "./section/icrc27-accounts.section.js"

type Fixtures = {
  section: Icrc49CallCanisterSection
  demoPage: StandardsPage
  requestPermissionSection: Icrc25RequestPermissionsSection
  icrc25AccountsSection: Icrc25AccountsSection
  nfidPage: Page
}

const test = base.extend<Fixtures>({
  section: async ({ page }, apply) => {
    const section = new Icrc49CallCanisterSection(page)
    await apply(section)
  },
  demoPage: async ({ page }, apply) => {
    const demoPage = new StandardsPage(page)
    await demoPage.goto()
    await apply(demoPage)
  },
  requestPermissionSection: async ({ page }, apply) => {
    const requestPermissionSection = new Icrc25RequestPermissionsSection(page)
    await apply(requestPermissionSection)
  },
  icrc25AccountsSection: async ({ page }, apply) => {
    const requestPermissionSection = new Icrc25AccountsSection(page)
    await apply(requestPermissionSection)
  },
  nfidPage: async ({ context, demoPage }, apply) => {
    const nfidPage = await context.newPage()
    await nfidPage.goto("https://dev.nfid.one/")
    await demoPage.setAccount(10974, nfidPage)
    await context.pages()[0]!.bringToFront()
    await apply(nfidPage)
    await nfidPage.close()
  },
})

const accounts = await StandardsPage.getAccounts()
for (const account of accounts) {
  test.describe(`ICRC49-call-canister methods for ${account.type} user`, () => {
    test(`${account.type} user should check request and response has correct initial state for no consent case`, async ({
      section,
      demoPage,
      requestPermissionSection,
      nfidPage,
    }) => {
      await nfidPage.title()
      await section.loginAndApprovePermissions(demoPage, requestPermissionSection, account)
      await section.checkRequestResponse(
        section,
        ExpectedTexts.General.NoConsentCaseInitialCanisterCallState
      )
      await demoPage.logout()
    })

    test(`${account.type} user should check request and response has correct initial state for consent case`, async ({
      section,
      demoPage,
      requestPermissionSection,
      nfidPage,
    }) => {
      await nfidPage.title()
      await section.loginAndApprovePermissions(demoPage, requestPermissionSection, account)
      await section.setSelectedMethod(section.availableMethods.selectConsentTab)
      await section.checkRequestResponse(
        section,
        ExpectedTexts.General.ConsentCaseInitialCanisterCallState
      )
      await demoPage.logout()
    })

    test(`${account.type} user should make canister call: Basic`, async ({
      section,
      demoPage,
      requestPermissionSection,
      icrc25AccountsSection,
      context,
      nfidPage,
    }) => {
      await nfidPage.title()
      await section.loginAndApprovePermissions(demoPage, requestPermissionSection, account)
      if (account.type === AccountType.MockedSigner) {
        await section.openPopup(context)
        const texts = await section.getMockedPopupText()
        expect(texts).toEqual(ExpectedTexts.Mocked.NoConsentCaseCanisterCallRequest)
        await section.mockedApproveButton.click()
      } else {
        await icrc25AccountsSection.selectAccountsNFID(context)
        await section.setCallCanisterOwner(
          '"7f3jf-ns7yl-tjcdk-fijk6-avi55-g5uyp-orxk6-4pv6p-f6d2c-7nex5-nae"'
        )
        await section.openPopup(context)
        await section.checkPopupTextNFID(ExpectedTexts.NFID.NoConsentCaseCanisterCall)
        await section.nfidApproveButton.click()
      }

      await section.waitForResponse()
      const actualResponse = await section.getResponseJson()

      expect(actualResponse).toMatchObject(ExpectedTexts.General.NoConsentCaseCanisterCallResponse)
      await demoPage.logout()
    })

    test(`${account.type} user should make canister call: With consent message`, async ({
      section,
      demoPage,
      requestPermissionSection,
      icrc25AccountsSection,
      context,
      nfidPage,
    }) => {
      await nfidPage.title()
      await section.loginAndApprovePermissions(demoPage, requestPermissionSection, account)
      await section.setSelectedMethod(section.availableMethods.selectConsentTab)

      if (account.type === AccountType.MockedSigner) {
        await section.openPopup(context)
        const texts = await section.getMockedPopupText()
        expect(texts).toEqual(ExpectedTexts.Mocked.ConsentCaseCanisterCallRequest)
        await section.mockedApproveButton.click()
      } else {
        await icrc25AccountsSection.selectAccountsNFID(context)
        await section.setCallCanisterOwner(
          '"7f3jf-ns7yl-tjcdk-fijk6-avi55-g5uyp-orxk6-4pv6p-f6d2c-7nex5-nae"'
        )
        await section.openPopup(context)
        await section.checkPopupTextNFID(ExpectedTexts.NFID.ConsentCaseCanisterCall)
        await section.nfidApproveButton.click()
      }

      await section.waitForResponse()
      const actualResponse = await section.getResponseJson()

      expect(actualResponse).toMatchObject(ExpectedTexts.General.ConsentCaseCanisterCallResponse)
      await demoPage.logout()
    })

    test(`${account.type} user should make canister call: ICRC-2 approve`, async ({
      section,
      demoPage,
      requestPermissionSection,
      icrc25AccountsSection,
      context,
      nfidPage,
    }) => {
      await nfidPage.title()
      await section.loginAndApprovePermissions(demoPage, requestPermissionSection, account)

      await section.setSelectedMethod(section.availableMethods.selectIcrc2ApprovalTab)

      if (account.type === AccountType.MockedSigner) {
        await section.openPopup(context)
        const texts = await section.getMockedPopupText()

        expect(texts).toEqual(ExpectedTexts.Mocked.CanisterCallIcrc2ApproveRequest)
        await section.mockedApproveButton.click()
      } else {
        await icrc25AccountsSection.selectAccountsNFID(context)
        await section.setCallCanisterOwner(
          '"7f3jf-ns7yl-tjcdk-fijk6-avi55-g5uyp-orxk6-4pv6p-f6d2c-7nex5-nae"'
        )
        await section.openPopup(context)
        await section.checkPopupTextNFID(ExpectedTexts.NFID.CanisterCallIcrc2ApproveRequest)
        await section.nfidApproveButton.click()
      }

      await section.waitForResponse()
      const actualResponse = await section.getResponseJson()

      expect(actualResponse).toMatchObject(ExpectedTexts.General.CanisterCallIcrc2ApproveResponse)
      await demoPage.logout()
    })

    test(`${account.type} user should make canister call: ICRC-1 transfer`, async ({
      section,
      demoPage,
      requestPermissionSection,
      icrc25AccountsSection,
      context,
      nfidPage,
    }) => {
      await nfidPage.title()
      await section.loginAndApprovePermissions(demoPage, requestPermissionSection, account)
      await section.setSelectedMethod(section.availableMethods.selectIcrc1TransferTab)

      if (account.type === AccountType.MockedSigner) {
        await section.openPopup(context)
        const texts = await section.getMockedPopupText()

        expect(texts).toEqual(ExpectedTexts.Mocked.CanisterCallIcrc1TransferRequest)
        await section.mockedApproveButton.click()
      } else {
        await icrc25AccountsSection.selectAccountsNFID(context)
        await section.setCallCanisterOwner(
          '"7f3jf-ns7yl-tjcdk-fijk6-avi55-g5uyp-orxk6-4pv6p-f6d2c-7nex5-nae"'
        )
        await section.openPopup(context)
        await section.checkPopupTextNFID(ExpectedTexts.NFID.CanisterCallIcrc1TransferRequest)
        await section.nfidApproveButton.click()
      }

      await section.waitForResponse()
      const actualResponse = await section.getResponseJson()

      expect(actualResponse).toMatchObject(ExpectedTexts.General.CanisterCallIcrc1TransferResponse)

      await demoPage.logout()
    })
  })
}
