import { Header } from "./ui/molecules/header"
import { icrc49CallCanisterSection } from "./data"
import { Section } from "./ui/organisms/section"
import { ToastContainer } from "react-toastify"
import { IdentityKitAuthType } from "@nfid/identitykit"
import { AuthTypeTabs } from "./ui/organisms"

function App({
  authType,
  setAuthType,
  setShouldDisconnectWallet,
  setAuthTypeSwitched,
  shouldDisconnectWallet,
  authTypeSwitched,
  connectWalletSignerResponse,
}: {
  authType: IdentityKitAuthType
  setAuthType: (k: IdentityKitAuthType) => void
  setShouldDisconnectWallet: (param: boolean) => unknown
  shouldDisconnectWallet?: boolean
  setAuthTypeSwitched: (switched: boolean) => unknown
  authTypeSwitched?: boolean
  connectWalletSignerResponse: string
}) {
  return (
    <div className="h-full min-h-screen bg-white dark:bg-dark px-[30px] pb-[25px]">
      <ToastContainer />
      <Header triggerManualWalletDisconnect={shouldDisconnectWallet} />
      <h3 className="text-xl mt-[25px] mb-[20px]">
        Step 1. Choose which authentication method your users will connect with
      </h3>
      <AuthTypeTabs
        value={authType}
        onChange={(type) => {
          setAuthType(type)
          setAuthTypeSwitched(!authTypeSwitched)
          setShouldDisconnectWallet(true)
        }}
        accountsResponseJson={
          authType === IdentityKitAuthType.ACCOUNTS && !authTypeSwitched
            ? connectWalletSignerResponse
            : undefined
        }
        delegationResponseJson={
          authType === IdentityKitAuthType.DELEGATION && authTypeSwitched
            ? connectWalletSignerResponse
            : undefined
        }
      />
      <h3 className="text-xl mt-[30px] mb-[25px]">
        Step 2. Click Connect Wallet button (or disconnect and reconnect)
      </h3>
      <h3 className="text-xl mb-[25px]">
        Step 3. Interact with other smart contract canisters on behalf of your connected user
      </h3>
      <Section {...icrc49CallCanisterSection} />
    </div>
  )
}

export default App
