import { Header } from "./ui/molecules/header"
import {
  icrc25RequestPermissionsSection,
  icrc25PermissionsSection,
  icrc25SupportedStandardsSection,
  icrc27AccountsSection,
  icrc34DelegationSection,
  icrc49CallCanisterSection,
} from "./data"
import { Section } from "./ui/organisms/section"
import { ToastContainer } from "react-toastify"
import { SectionContainer } from "./ui/organisms/section-container"
import { IdentityKitProvider, IdentityKitTheme } from "@nfid/identitykit/react"
import { MockedSigner, NFID, SignerConfig } from "@nfid/identitykit"
import { useTheme } from "next-themes"
import { IdentityKitAuthKindType, IdentityKitAuthKind } from "@nfid/identitykit"
import { useState } from "react"

const icrc25data = [
  icrc25RequestPermissionsSection,
  icrc25PermissionsSection,
  icrc25SupportedStandardsSection,
]
const icrc27data = [icrc27AccountsSection]
const icrc34data = [icrc34DelegationSection]
const icrc49data = [icrc49CallCanisterSection]

const mockedSignerProviderUrl = import.meta.env.VITE_MOCKED_SIGNER_PROVIDER_URL
const nfidSignerProviderUrl = import.meta.env.VITE_MOCKED_NFID_SIGNER_PROVIDER_URL

function App() {
  const { theme } = useTheme()
  const [authKind, setAuthKind] = useState<IdentityKitAuthKindType>(IdentityKitAuthKind.DELEGATION)

  const nfid: SignerConfig = { ...NFID, providerUrl: nfidSignerProviderUrl }
  const mockedSigner: SignerConfig = { ...MockedSigner, providerUrl: mockedSignerProviderUrl }

  return (
    <IdentityKitProvider
      signers={[nfid, mockedSigner]}
      featuredSigner={nfid}
      theme={theme as IdentityKitTheme}
      authKind={authKind}
    >
      <div className="h-full min-h-screen bg-white dark:bg-dark px-[30px] pb-20">
        <ToastContainer />
        <Header />
        <div className="flex w-full">
          <select
            className="mb-4 ms-auto"
            onChange={(e) => setAuthKind(e.target.value as IdentityKitAuthKindType)}
          >
            <option value="">--Please choose auth option--</option>
            <option value={IdentityKitAuthKind.DELEGATION}>Delegation</option>
            <option value={IdentityKitAuthKind.ACCOUNTS}>Accounts</option>
          </select>
        </div>
        <div className="flex flex-col space-y-20">
          <SectionContainer title="1. ICRC-25: Signer Interaction Standard">
            {icrc25data.map((section, index) => (
              <Section key={index} {...section} />
            ))}
          </SectionContainer>
          <SectionContainer title="2. ICRC-27: Accounts">
            {icrc27data.map((section, index) => (
              <Section key={index} {...section} />
            ))}
          </SectionContainer>
          <SectionContainer title="3. ICRC-34: Delegation">
            {icrc34data.map((section, index) => (
              <Section key={index} {...section} />
            ))}
          </SectionContainer>
          <SectionContainer title="4. ICRC-49: Call canister">
            {icrc49data.map((section, index) => (
              <Section key={index} {...section} />
            ))}
          </SectionContainer>
        </div>
      </div>
    </IdentityKitProvider>
  )
}

export default App
