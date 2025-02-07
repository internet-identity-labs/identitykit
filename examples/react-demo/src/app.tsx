import { ToastContainer } from "react-toastify"
import { IdentityKitAuthType } from "@nfid/identitykit"
import { useAuth } from "@nfid/identitykit/react"
import { Header, AuthTypeTabs, CallCanisterSection } from "./ui"

function App({
  setAuthType,
  authType,
}: {
  setAuthType: (k: IdentityKitAuthType) => void
  authType: IdentityKitAuthType
}) {
  const { disconnect } = useAuth()

  return (
    <div
      id={"themeColor"}
      className="h-full min-h-screen bg-white dark:bg-dark px-[30px] pb-[25px]"
    >
      <ToastContainer />
      <Header />
      <h3 className="text-xl mt-[25px] mb-[20px]">
        Step 1. Choose which authentication method your users will connect with
      </h3>
      <AuthTypeTabs
        onChange={async (type) => {
          await disconnect()
          setAuthType(type)
        }}
        authType={authType}
      />
      <h3 className="text-xl mt-[30px] mb-[25px]">
        Step 2. Click Connect Wallet button (or disconnect and reconnect)
      </h3>
      <h3 className="text-xl mb-[25px]">
        Step 3. Interact with other smart contract canisters on behalf of your connected user
      </h3>
      <CallCanisterSection />
    </div>
  )
}

export default App
