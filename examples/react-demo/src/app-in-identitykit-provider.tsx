import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { IdentityKitProvider, IdentityKitTheme } from "@nfid/identitykit/react"
import { toast } from "react-toastify"
import {
  IdentityKitAuthType,
  IdentityKitSignerConfig,
  MockedSigner,
  NFIDW,
  Plug,
  InternetIdentity,
  Stoic,
} from "@nfid/identitykit"

import App from "./app"

const mockedSignerProviderUrl = import.meta.env.VITE_MOCKED_SIGNER_PROVIDER_URL
const nfidSignerProviderUrl = import.meta.env.VITE_MOCKED_NFID_SIGNER_PROVIDER_URL

const targetCanister = import.meta.env.VITE_TARGET_CANISTER
const environment = import.meta.env.VITE_ENVIRONMENT

const nfidw: IdentityKitSignerConfig = { ...NFIDW, providerUrl: nfidSignerProviderUrl }
const signers = [nfidw, Plug, InternetIdentity, Stoic].concat(
  environment === "dev"
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
        toast.error(
          e.message === "Not supported"
            ? "Internet Identity doesn’t support accounts. Switch to delegation."
            : e.message
        )
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
