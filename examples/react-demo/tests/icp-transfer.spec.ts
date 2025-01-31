import { expect, Page, test as base } from "@playwright/test"
import { DemoPage } from "./page/demoPage.ts"
import { ProfileSection } from "./section/profile.section.ts"
import { CallCanisterSection } from "./section/callCanister.section.ts"
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
    await context.pages()[0].bringToFront()
    await apply(nfidPage)
  },
})

const loginMethods = Object.keys(DemoPage.loginMethods)
const accounts = DemoPage.getAccounts()
for (const account of accounts) {
  for (const accountProfile of Object.keys(DemoPage.ProfileType)) {
    for (const method of loginMethods) {
      test.describe(`"ICP-transfer" methods for ${account.type} user`, () => {
        test(`User makes icp_transfer call canister via ${DemoPage.loginMethods[method]} login method with ${accountProfile} profile`, async ({
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
            DemoPage.ProfileType[accountProfile],
            profileSection,
            DemoPage.loginMethods[method]
          )

          await callCanisterSection.setSelectedMethod(
            callCanisterSection.availableMethods.icp_transfer
          )
          await callCanisterSection.checkRequestResponse(
            DemoPage.ProfileType[accountProfile] == "public"
              ? ExpectedTexts.General.Public.Initial_ICPTransfer_RequestState
              : ExpectedTexts.General.Anonymous.Initial_ICPTransfer_RequestState
          )

          await (
            await callCanisterSection.requestBuilder
              .setAmount("10000") //0.0001 ICP
              .setToPrincipal("themselves")
          ).apply()

          if (DemoPage.ProfileType[accountProfile] == "public") {
            await callCanisterSection.clickSubmitButtonAndGetPopup(context)
            await callCanisterSection.checkNFIDPopupText(
              ExpectedTexts.NFID.Public.ICPTransferRPCText
            )
            await callCanisterSection.NFIDApproveButton.click()
            await callCanisterSection.waitForResponse()
          } else await callCanisterSection.callCanisterSubmitButton.click()

          await callCanisterSection.waitForNotEmptyResponse()
          const actualResponse = await callCanisterSection.getResponseJson()
          expect(actualResponse).toMatchObject(
            DemoPage.ProfileType[accountProfile] == "public"
              ? ExpectedTexts.NFID.Public.ICPTransferResponse
              : ExpectedTexts.NFID.Anonymous.ICPTransferResponse
          )

          await demoPage.logout()
        })
      })
    }
  }
}
