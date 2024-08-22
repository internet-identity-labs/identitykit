import { useState } from "react"
import App from "./App.tsx"
import { useTheme } from "next-themes"
import { IdentityKitProvider, IdentityKitTheme } from "@nfid/identitykit/react"
import {
  IdentityKitAuthType,
  MockedSigner,
  NFIDW,
  IdentityKitSignerConfig,
} from "@nfid/identitykit"

const mockedSignerProviderUrl = import.meta.env.VITE_MOCKED_SIGNER_PROVIDER_URL
const nfidSignerProviderUrl = import.meta.env.VITE_MOCKED_NFID_SIGNER_PROVIDER_URL

const targetCanister = import.meta.env.VITE_TARGET_CANISTER
const environment = import.meta.env.VITE_ENVIRONMENT

export function AppWrappedInIdentityKit() {
  const [authType, setAuthType] = useState<IdentityKitAuthType>(IdentityKitAuthType.ACCOUNTS)
  const { theme } = useTheme()
  const nfidw: IdentityKitSignerConfig = { ...NFIDW, providerUrl: nfidSignerProviderUrl }
  const signers = [nfidw]

  if (environment === "dev") {
    signers.push({
      ...MockedSigner,
      providerUrl: mockedSignerProviderUrl,
    })
  }

  return (
    <IdentityKitProvider
      signers={signers}
      featuredSigner={nfidw}
      theme={theme as IdentityKitTheme}
      authType={authType}
      signerClientOptions={{
        targets: [targetCanister],
      }}
    >
      <App authType={authType} setAuthType={setAuthType} />
    </IdentityKitProvider>
  )
}
