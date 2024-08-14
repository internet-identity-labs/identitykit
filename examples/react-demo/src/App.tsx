import { Header } from "./ui/molecules/header"
import { icrc49CallCanisterSection } from "./data"
import { Section } from "./ui/organisms/section"
import { ToastContainer } from "react-toastify"
import { IdentityKitAuthType } from "@nfid/identitykit"
import { useState } from "react"
import { AuthKindTabs } from "./ui/organisms"

function App({
  authType,
  setAuthType,
}: {
  authType: IdentityKitAuthType
  setAuthType: (k: IdentityKitAuthType) => void
}) {
  const [connectWalletSignerResponse, setConnectWalletSignerResponse] = useState("{}")
  const [authKindSwitched, setAuthKindSwitched] = useState(false)
  const [shouldDisconnectWallet, setShouldDisconnectWallet] = useState(false)

  return (
    <div className="h-full min-h-screen bg-white dark:bg-dark px-[30px] pb-20">
      <ToastContainer />
      <Header
        onConnectWalletSuccess={(response) =>
          setConnectWalletSignerResponse(JSON.stringify(response, null, 2))
        }
        onWalletDisconnect={() => {
          setConnectWalletSignerResponse("{}")
          setShouldDisconnectWallet(false)
        }}
        triggerManualWalletDisconnect={shouldDisconnectWallet}
      />
      <h5 className="font-semibold mb-4 mt-6 sm:mt-12">
        1. Choose which authentication method your users will connect with
      </h5>
      <AuthKindTabs
        value={authType}
        onChange={(kind) => {
          setAuthType(kind)
          setAuthKindSwitched(!authKindSwitched)
          setShouldDisconnectWallet(true)
        }}
        accountsResponseJson={
          authType === IdentityKitAuthType.ACCOUNTS && authKindSwitched
            ? connectWalletSignerResponse
            : undefined
        }
        delegationResponseJson={
          authType === IdentityKitAuthType.DELEGATION && !authKindSwitched
            ? connectWalletSignerResponse
            : undefined
        }
      />
      <h5 className="font-semibold mt-8">
        2. Click Connect Wallet button (or disconnect and reconnect)
      </h5>
      <h5 className="font-semibold mb-8">
        3. Interact with other smart contract canisters on behalf of your connected user
      </h5>
      <Section {...icrc49CallCanisterSection} />
    </div>
  )
}

export default App
