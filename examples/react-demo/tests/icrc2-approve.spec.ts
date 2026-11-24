import { expect, Page, test as base } from "@playwright/test"
import { DemoPage } from "./page/demoPage.js"
import { ProfileSection } from "./section/profile.section.js"
import { CallCanisterSection } from "./section/callCanister.section.js"
import { ExpectedTexts } from "./section/expectedTexts.js"
import { NFID_URL } from "../../shared/e2e/config.js"
import { NFIDW_USER } from "./helpers/test-user.js"
import { assertLedgerBalance, ICP_LEDGER } from "../../shared/e2e/ledger.js"

const ICP_FEE_E8S = BigInt(10_000)

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
    await nfidPage.goto(NFID_URL, { waitUntil: "domcontentloaded" })
    await demoPage.setAccount(NFIDW_USER.anchor, nfidPage)
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
      test.describe(`"ICRC2-approve" methods for ${account.type} user`, () => {
        test(`User makes icrc2_approve call canister via ${DemoPage.loginMethods[method]} login method with ${DemoPage.profileType[accountProfile]} profile`, async ({
          demoPage,
          callCanisterSection,
          nfidPage,
          profileSection,
          context,
        }) => {
          // Only the public wallet spends ICP in this test (0.0001 ICP + ledger fee)
          if (DemoPage.profileType[accountProfile] == "public")
            await assertLedgerBalance(ICP_LEDGER, NFIDW_USER.publicPrincipal, ICP_FEE_E8S)
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
            callCanisterSection.availableMethods.icrc2_approve!
          )
          await callCanisterSection.checkRequestResponse(
            DemoPage.profileType[accountProfile] == "public"
              ? ExpectedTexts.General.Public.Initial_ICRC2Approve_RequestState
              : ExpectedTexts.General.Anonymous.Initial_ICRC2Approve_RequestState
          )

          if (DemoPage.profileType[accountProfile] == "legacy_0") return

          const userInitialBalance = await demoPage.getIcpBalance()

          const amountToSend = "10000"
          await callCanisterSection.requestBuilder
            .setTokenID("ryjl3-tyaaa-aaaaa-aaaba-cai") //ICP token
            .setAmount("10000") //0.0001 ICP
            .apply()

          await callCanisterSection.clickSubmitButtonAndGetPopup(context)
          await callCanisterSection.checkNFIDPopupText(
            ExpectedTexts.NFID.Public.ICRC2ApproveRpcText
          )
          await callCanisterSection.approveInNfidPopup()

          await callCanisterSection.waitForResponse()
          const actualResponse = await callCanisterSection.getResponseJson()
          expect(actualResponse).toMatchObject(ExpectedTexts.NFID.Public.ICRC2Response)

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
