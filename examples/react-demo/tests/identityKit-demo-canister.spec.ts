import { expect, Page, test as base } from "@playwright/test"
import { DemoPage } from "./page/demoPage.js"
import { ProfileSection } from "./section/profile.section.js"
import { CallCanisterSection } from "./section/callCanister.section.js"
import { ExpectedTexts } from "./section/expectedTexts.js"

type Fixtures = {
  demoPage: DemoPage
  nfidPage: Page
  profileSection: ProfileSection
  callCanisterSection: CallCanisterSection
}

const test = base.extend<Fixtures>({
  profileSection: async ({ page }, apply) => {
    const profile = new ProfileSection(page)
    await apply(profile)
  },
  callCanisterSection: async ({ page }, apply) => {
    const callCanisterSection = new CallCanisterSection(page)
    await apply(callCanisterSection)
  },
  demoPage: async ({ page }, apply) => {
    const demoPage = new DemoPage(page)
    await demoPage.goto()
    await apply(demoPage)
  },
  nfidPage: async ({ context, demoPage }, apply) => {
    const nfidPage = await context.newPage()
    await nfidPage.goto("https://dev.nfid.one/")
    await demoPage.setAccount(10974, nfidPage)
    await context.pages()[0]!.bringToFront()
    await apply(nfidPage)
  },
})

const loginMethods = Object.keys(DemoPage.loginMethods) as (keyof typeof DemoPage.loginMethods)[]
const accounts = DemoPage.getAccounts()
for (const account of accounts) {
  for (const accountProfile of Object.keys(
    DemoPage.profileType
  ) as (keyof typeof DemoPage.profileType)[]) {
    for (const method of loginMethods) {
      test.describe(`"Canister query call to IdentityKit Demo canister for ${account.type} user`, () => {
        test(`User makes canister query call to IdentityKit demo canister via ${DemoPage.loginMethods[method]} login method with ${DemoPage.profileType[accountProfile]} profile`, async ({
          demoPage,
          nfidPage,
          callCanisterSection,
          profileSection,
          context,
        }) => {
          await nfidPage.title()
          await demoPage.login(
            context,
            account,
            DemoPage.profileType[accountProfile],
            profileSection,
            DemoPage.loginMethods[method]
          )

          await callCanisterSection.verifyThemeChanging()

          await callCanisterSection.setSelectedMethod(
            callCanisterSection.availableMethods.call_to_identityKit_demo_canister!
          )
          await callCanisterSection.checkRequestResponse(
            DemoPage.profileType[accountProfile] == "public"
              ? ExpectedTexts.General.Public.Initial_IdentityKitDemoCall_RequestState
              : ExpectedTexts.General.Anonymous.Initial_IdentityKitDemoCall_RequestState
          )

          if (DemoPage.profileType[accountProfile] == "legacy_0") return

          if (DemoPage.loginMethods[method] == "Accounts") {
            await callCanisterSection.clickSubmitButtonAndGetPopup(context)
            await callCanisterSection.checkNFIDPopupText(
              ExpectedTexts.NFID.Public.IdentityKitDemoCallRPCText
            )
            await callCanisterSection.NFIDApproveButton.click()
          } else await callCanisterSection.callCanisterSubmitButton.click()

          await callCanisterSection.waitForNotEmptyResponse()
          const actualResponse = await callCanisterSection.getResponse()
          expect([actualResponse]).toEqual(ExpectedTexts.NFID.Public.IdentityKitDemoCallResponse)

          await demoPage.logout()
        })
      })
    }
  }
}
