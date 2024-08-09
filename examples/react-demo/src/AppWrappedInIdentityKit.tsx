import { useState } from "react"
import App from "./App.tsx"
import { useTheme } from "next-themes"
import { IdentityKitProvider, IdentityKitTheme } from "@nfid/identitykit/react"
import {
  IdentityKitAuthKind,
  IdentityKitAuthKindType,
  MockedSigner,
  NFID,
  SignerConfig,
} from "@nfid/identitykit"

const mockedSignerProviderUrl = import.meta.env.VITE_MOCKED_SIGNER_PROVIDER_URL
const nfidSignerProviderUrl = import.meta.env.VITE_MOCKED_NFID_SIGNER_PROVIDER_URL

export function AppWrappedInIdentityKit() {
  const [authKind, setAuthKind] = useState<IdentityKitAuthKindType>(IdentityKitAuthKind.DELEGATION)
  const { theme } = useTheme()
  const nfid: SignerConfig = { ...NFID, providerUrl: nfidSignerProviderUrl }
  const mockedSigner: SignerConfig = { ...MockedSigner, providerUrl: mockedSignerProviderUrl }

  return (
    <IdentityKitProvider
      signers={[nfid, mockedSigner]}
      featuredSigner={nfid}
      theme={theme?.toUpperCase() as IdentityKitTheme}
      authKind={authKind}
    >
      <App authKind={authKind} setAuthKind={setAuthKind} />
    </IdentityKitProvider>
  )
}
