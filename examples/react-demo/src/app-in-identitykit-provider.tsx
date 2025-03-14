import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { IdentityKitProvider, IdentityKitTheme } from "@nfid/identitykit/react"
import { toast } from "react-toastify"
import {
  IdentityKitAuthType,
  IdentityKitSignerConfig,
  MockedSigner,
  NFIDW,
  InternetIdentity,
  Stoic,
  OISY,
} from "@nfid/identitykit"

import App from "./app"

const mockedSignerProviderUrl = import.meta.env.VITE_MOCKED_SIGNER_PROVIDER_URL
const nfidSignerProviderUrl = import.meta.env.VITE_MOCKED_NFID_SIGNER_PROVIDER_URL

const targetCanister = import.meta.env.VITE_TARGET_CANISTER
const environment = import.meta.env.VITE_ENVIRONMENT

const ConnectFailureError: Record<string, string> = {
  "The request sent by the relying party is not supported by the signer.":
    "OISY doesn’t support delegation. Switch to accounts.",
  "Not supported": "Internet Identity doesn’t support accounts. Switch to delegation.",
}

const nfidw: IdentityKitSignerConfig = { ...NFIDW, providerUrl: nfidSignerProviderUrl }
const signers = [nfidw, InternetIdentity, OISY, Stoic].concat(
  environment !== "ic"
    ? [
        {
          ...MockedSigner,
          providerUrl: mockedSignerProviderUrl,
        },
      ]
    : []
)

export function AppWrappedInIdentityKit() {
  const [authType, setAuthType] = useState<IdentityKitAuthType>(IdentityKitAuthType.DELEGATION)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const localStorageAuthType = localStorage.getItem("authType")
    if (localStorageAuthType) setAuthType(localStorageAuthType as IdentityKitAuthType)
  }, [])

  return (
    <IdentityKitProvider
      signers={signers}
      featuredSigner={nfidw}
      theme={resolvedTheme as IdentityKitTheme}
      authType={authType}
      signerClientOptions={{
        targets: [targetCanister],
      }}
      onConnectFailure={(e) => {
        toast.error(ConnectFailureError[e.message] || e.message)
      }}
      onConnectSuccess={() => {
        localStorage.setItem("authType", authType)
      }}
    >
      <App
        setAuthType={(aT) => {
          setAuthType(aT)
          localStorage.removeItem("authType")
        }}
        authType={authType}
      />
    </IdentityKitProvider>
  )
}
