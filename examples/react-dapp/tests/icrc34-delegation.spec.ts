import { expect, Page, test as base } from "@playwright/test"
import { Account, AccountType, StandardsPage, ProfileType } from "./page/standards.page.ts"
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
    await nfidPage.close()
  },
})

test.describe("ICRC25 delegation", () => {
  let accounts: Account[] = []

  test.beforeEach(async ({ page }) => {
    accounts = await StandardsPage.getAccounts(page)
  })
  test("should check request and response has correct initial state", async ({
    section,
    demoPage,
  }) => {
    for (const account of accounts) {
      await demoPage.login(account)

      const initialRequest = await section.getRequestJson()
      expect(initialRequest).toStrictEqual(ExpectedTexts.General.InitialDelegationRequestState)

      const initialResponse = await section.getResponseJson()
      expect(initialResponse).toStrictEqual({})
      await demoPage.logout()
    }
  })

  test("should request global delegation with targets", async ({
    section,
    demoPage,
    requestPermissionSection,
    nfidPage,
    context,
  }) => {
    await nfidPage.title()
    const account = accounts[0]
    await demoPage.login(account)
    await requestPermissionSection.approvePermissions(account)

    if (account.type === AccountType.MockedSigner) {
      await section.selectProfileMocked(ProfileType.Global, (isGlobalDisabled) =>
        expect(isGlobalDisabled).toBeFalsy()
      )
    } else await section.selectProfileNFID(demoPage.page, context)

    await section.waitForResponse()
    const actualResponse = await section.getResponseJson()

    expect(actualResponse).toMatchObject(ExpectedTexts.Mocked.DelegationWithTargetsResponse)
    await demoPage.logout()
  })

  test("should request session delegation with no targets", async ({
    section,
    demoPage,
    requestPermissionSection,
    nfidPage,
    context,
  }) => {
    const account = accounts[0]
    await nfidPage.title()
    await demoPage.login(account)
    await requestPermissionSection.approvePermissions(account)
    await section.setRequestWithNoTargets()

    if (account.type === AccountType.MockedSigner) {
      await section.selectProfileMocked(ProfileType.Session, (isGlobalDisabled) =>
        expect(isGlobalDisabled).toBeTruthy()
      )
    } else await section.selectProfileNFID(demoPage.page, context)

    await section.waitForResponse()
    const actualResponse = await section.getResponseJson()
    expect(actualResponse).toMatchObject(
      account.type === AccountType.MockedSigner
        ? ExpectedTexts.Mocked.NoTargetsDelegationResponse
        : ExpectedTexts.NFID.NoTargetsDelegationResponse
    )
    await demoPage.logout()
  })
})
