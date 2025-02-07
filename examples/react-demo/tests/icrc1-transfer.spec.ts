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
      test.describe(`"ICRC1-transfer" methods for ${account.type} user`, () => {
        test(`User makes icrc1_transfer call canister via ${DemoPage.loginMethods[method]} login method with ${DemoPage.profileType[accountProfile]} profile`, async ({
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

          await context.pages()[context.pages().length - 1]!.reload()
          await context.pages()[context.pages().length - 1]!.waitForLoadState("load")

          await callCanisterSection.setSelectedMethod(
            callCanisterSection.availableMethods.icrc1_transfer!
          )
          await callCanisterSection.checkRequestResponse(
            DemoPage.profileType[accountProfile] == "public"
              ? ExpectedTexts.General.Public.Initial_ICRC1Transfer_RequestState
              : ExpectedTexts.General.Anonymous.Initial_ICRC1Transfer_RequestState
          )

          if (DemoPage.profileType[accountProfile] == "legacy_0") return

          const userInitialBalance = parseFloat(
            (await demoPage.userBalance.textContent())!.replace(" ICP", "")
          )

          const amountToSend = "10000"
          await (
            await callCanisterSection.requestBuilder
              .setTokenID("ryjl3-tyaaa-aaaaa-aaaba-cai") //ICP token
              .setAmount("10000") //0.0001 ICP
              .setToPrincipal("themselves")
          ).apply()

          await callCanisterSection.clickSubmitButtonAndGetPopup(context)
          await callCanisterSection.checkNFIDPopupText(
            ExpectedTexts.NFID.Public.ICRC1TransferRPCText
          )
          await callCanisterSection.NFIDApproveButton.click()

          await callCanisterSection.waitForResponse()
          const actualResponse = await callCanisterSection.getResponseJson()
          expect(actualResponse).toMatchObject(ExpectedTexts.NFID.Public.ICRC1TransferResponse)

          if (DemoPage.loginMethods[method] == "Delegation") {
            await callCanisterSection.verifyBalanceChanged(
              userInitialBalance,
              parseFloat(amountToSend) / 100000000
            )
          }

          await demoPage.logout()
        })
      })
    }
  }
}
