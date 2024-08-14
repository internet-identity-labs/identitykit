import { useState } from "react"
import App from "./App.tsx"
import { useTheme } from "next-themes"
import { IdentityKitProvider, IdentityKitTheme } from "@nfid/identitykit/react"
import { IdentityKitAuthType, MockedSigner, NFIDW, SignerConfig } from "@nfid/identitykit"

const mockedSignerProviderUrl = import.meta.env.VITE_MOCKED_SIGNER_PROVIDER_URL
const nfidSignerProviderUrl = import.meta.env.VITE_MOCKED_NFID_SIGNER_PROVIDER_URL
const targetCanister = import.meta.env.VITE_TARGET_CANISTER

export function AppWrappedInIdentityKit() {
  const [authType, setAuthType] = useState<IdentityKitAuthType>(IdentityKitAuthType.DELEGATION)
  const { theme } = useTheme()
  const nfidw: SignerConfig = { ...NFIDW, providerUrl: nfidSignerProviderUrl }
  const mockedSigner: SignerConfig = { ...MockedSigner, providerUrl: mockedSignerProviderUrl }

  return (
    <IdentityKitProvider
      signers={[nfidw, mockedSigner]}
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
