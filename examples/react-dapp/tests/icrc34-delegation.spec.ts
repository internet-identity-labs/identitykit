import { expect, Page, test as base } from "@playwright/test"
import { AccountType, ProfileType, StandardsPage } from "./page/standards.page.ts"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section.ts"
import { Icrc34DelegationSection } from "./section/icrc34-delegation.section.ts"
import { ExpectedTexts } from "./section/expectedTexts.ts"

type Fixtures = {
  section: Icrc34DelegationSection
  demoPage: StandardsPage
  requestPermissionSection: Icrc25RequestPermissionsSection
  nfidPage: Page
}

const test = base.extend<Fixtures>({
  section: async ({ page }, use) => {
    const section = new Icrc34DelegationSection(page)
    await use(section)
  },
  demoPage: async ({ page }, use) => {
    const demoPage = new StandardsPage(page)
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
  },
})

const accounts = await StandardsPage.getAccounts()
for (const account of accounts) {
  test.describe(`ICRC25 delegation for ${account.type} user`, () => {
    test(`should check request and response has correct initial state for ${account.type} user`, async ({
      section,
      demoPage,
    }) => {
      await demoPage.login(account)

      const initialRequest = await section.getRequestJson()
      expect(initialRequest).toStrictEqual(ExpectedTexts.General.InitialDelegationRequestState)

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    })

    test(`${account.type} user should request global delegation with targets`, async ({
      section,
      demoPage,
      requestPermissionSection,
      nfidPage,
      context,
    }) => {
      await nfidPage.title()
      await demoPage.login(account)
      await requestPermissionSection.approvePermissions(account)

      if (account.type === AccountType.MockedSigner) {
        await section.selectProfileMocked(ProfileType.Global, (isGlobalDisabled) =>
          expect(isGlobalDisabled).toBeFalsy()
        )
      } else await section.selectProfileNFID(demoPage.page, "anonymous", context)

      await section.waitForResponse()
      const actualResponse = await section.getResponseJson()
      expect(actualResponse).toStrictEqual(
        account.type === AccountType.MockedSigner
          ? ExpectedTexts.Mocked.DelegationWithTargetsResponse
          : ExpectedTexts.NFID.DelegationWithTargetsResponse
      )
      await demoPage.logout()
      await nfidPage.close()
    })

    test(`${account.type} user should request session delegation with no targets`, async ({
      section,
      demoPage,
      requestPermissionSection,
      nfidPage,
      context,
    }) => {
      await demoPage.login(account)
      await requestPermissionSection.approvePermissions(account)
      await section.setRequestWithNoTargets()

      if (account.type === AccountType.MockedSigner) {
        await section.selectProfileMocked(ProfileType.Session, (isGlobalDisabled) =>
          expect(isGlobalDisabled).toBeTruthy()
        )
      } else await section.selectProfileNFID(demoPage.page, "anonymous", context)

      await section.waitForResponse()
      const actualResponse = await section.getResponseJson()
      expect(actualResponse).toMatchObject(
        account.type === AccountType.MockedSigner
          ? ExpectedTexts.Mocked.NoTargetsDelegationResponse
          : ExpectedTexts.NFID.NoTargetsDelegationResponse
      )
      await demoPage.logout()
      await nfidPage.close()
    })
  })
}
