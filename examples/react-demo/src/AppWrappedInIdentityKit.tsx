import { useState } from "react"
import App from "./App.tsx"
import { useTheme } from "next-themes"
import { IdentityKitProvider, IdentityKitTheme } from "@nfid/identitykit/react"
import {
  IdentityKitAuthType,
  IdentityKitSignerConfig,
  MockedSigner,
  NFIDW,
  Plug,
  InternetIdentity,
  Stoic,
} from "@nfid/identitykit"
import { toast } from "react-toastify"

const mockedSignerProviderUrl = import.meta.env.VITE_MOCKED_SIGNER_PROVIDER_URL
const nfidSignerProviderUrl = import.meta.env.VITE_MOCKED_NFID_SIGNER_PROVIDER_URL

const targetCanister = import.meta.env.VITE_TARGET_CANISTER
const environment = import.meta.env.VITE_ENVIRONMENT

export function AppWrappedInIdentityKit() {
  const [authType, setAuthType] = useState<IdentityKitAuthType>(IdentityKitAuthType.ACCOUNTS)
  const [connectWalletSignerResponse, setConnectWalletSignerResponse] = useState("{}")
  const [authTypeSwitched, setAuthTypeSwitched] = useState(false)
  const [shouldDisconnectWallet, setShouldDisconnectWallet] = useState(false)
  const { resolvedTheme } = useTheme()
  const nfidw: IdentityKitSignerConfig = { ...NFIDW, providerUrl: nfidSignerProviderUrl }
  const signers = [nfidw, Plug, InternetIdentity, Stoic]

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
      theme={resolvedTheme as IdentityKitTheme}
      authType={authType}
      signerClientOptions={{
        targets: [targetCanister],
      }}
      onConnectSuccess={(response) =>
        setConnectWalletSignerResponse(JSON.stringify(response, null, 2))
      }
      onDisconnect={() => {
        setConnectWalletSignerResponse("{}")
        setShouldDisconnectWallet(false)
      }}
      onConnectFailure={(e) => {
        toast.error(e.message)
      }}
    >
      <App
        authType={authType}
        setAuthType={setAuthType}
        connectWalletSignerResponse={connectWalletSignerResponse}
        authTypeSwitched={authTypeSwitched}
        setAuthTypeSwitched={setAuthTypeSwitched}
        shouldDisconnectWallet={shouldDisconnectWallet}
        setShouldDisconnectWallet={setShouldDisconnectWallet}
      />
    </IdentityKitProvider>
  )
}
