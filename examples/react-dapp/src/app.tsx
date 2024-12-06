import { Header } from "./ui/molecules"
import { ToastContainer } from "react-toastify"
import { IdentityKitProvider, IdentityKitTheme } from "@nfid/identitykit/react"
import {
  MockedSigner,
  NFIDW,
  Plug,
  PrimeVault,
  InternetIdentity,
  IdentityKitSignerConfig,
  Stoic,
} from "@nfid/identitykit"
import { useTheme } from "next-themes"
import {
  Icrc25PermissionsSection,
  Icrc25RequestPermissionsSection,
  Icrc25SupportedStandardsSection,
  Icrc27AccountsSection,
  Icrc34DelegationSection,
  Icrc49CallCanisterSection,
} from "./ui"

const mockedSignerProviderUrl = import.meta.env.VITE_MOCKED_SIGNER_PROVIDER_URL
const nfidSignerProviderUrl = import.meta.env.VITE_MOCKED_NFID_SIGNER_PROVIDER_URL
const environment = import.meta.env.VITE_ENVIRONMENT

function App() {
  const { resolvedTheme } = useTheme()
  const nfidw: IdentityKitSignerConfig = { ...NFIDW, providerUrl: nfidSignerProviderUrl }
  const signers = [nfidw, Plug, InternetIdentity, Stoic].concat(
    environment === "dev"
      ? [
          PrimeVault,
          {
            ...MockedSigner,
            providerUrl: mockedSignerProviderUrl,
          },
        ]
      : []
  )

  return (
    <IdentityKitProvider
      signers={signers}
      theme={resolvedTheme as IdentityKitTheme}
      realConnectDisabled
    >
      <div className="h-full min-h-screen bg-white dark:bg-dark px-[30px] pb-20">
        <ToastContainer />
        <Header />
        <div className="flex flex-col space-y-20">
          <div>
            <h2 className="mb-5 text-2xl mb-3">1. ICRC-25: Signer Interaction Standard</h2>
            <div className="space-y-10">
              <Icrc25RequestPermissionsSection />
              <Icrc25PermissionsSection />
              <Icrc25SupportedStandardsSection />
            </div>
          </div>
          <div>
            <h2 className="mb-5 text-2xl mb-3">2. ICRC-27: Accounts</h2>
            <div className="space-y-10">
              <Icrc27AccountsSection />
            </div>
          </div>
          <div>
            <h2 className="mb-5 text-2xl mb-3">3. ICRC-34: Delegation</h2>
            <div className="space-y-10">
              <Icrc34DelegationSection />
            </div>
          </div>
          <div>
            <h2 className="mb-5 text-2xl mb-3">4. ICRC-49: Call canister</h2>
            <div className="space-y-10">
              <Icrc49CallCanisterSection />
            </div>
          </div>
        </div>
      </div>
    </IdentityKitProvider>
  )
}

export default App
