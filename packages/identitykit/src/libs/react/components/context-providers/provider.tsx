import { useState, useCallback, PropsWithChildren, useMemo, useEffect } from "react"
import {
  IdentityKitAuthType,
  IdentityKitAccountsSignerClientOptions,
  IdentityKitDelegationSignerClientOptions,
  NFIDW,
  Plug,
  InternetIdentity,
  Stoic,
  OISY,
} from "../../../../lib"
import { useCreateIdentityKit, useCreatePromise, useProceedSigner } from "../../hooks"
import { validateUrl } from "../../utils"
import { SignerConfig, TransportType } from "../../../../lib/types"
import { ConnectWalletModal } from "../connect-wallet"
import { IdentityKitTheme } from "../../constants"
import { ThemeProvider } from "./theme-provider"
import { Context } from "../../contexts"
import { BrowserExtensionTransport } from "@slide-computer/signer-extension"

interface ProviderProps<T extends IdentityKitAuthType = typeof IdentityKitAuthType.ACCOUNTS>
  extends PropsWithChildren {
  authType?: T
  signers?: SignerConfig[]
  featuredSigner?: SignerConfig | false
  discoverExtensionSigners?: boolean
  theme?: IdentityKitTheme
  signerClientOptions?: T extends typeof IdentityKitAuthType.DELEGATION
    ? Omit<IdentityKitDelegationSignerClientOptions, "signer" | "crypto" | "agent">
    : Omit<IdentityKitAccountsSignerClientOptions, "signer" | "crypto" | "agent">
  onConnectFailure?: (e: Error) => unknown
  onConnectSuccess?: () => unknown
  onDisconnect?: () => unknown
  realConnectDisabled?: boolean
  crypto?: Pick<Crypto, "getRandomValues" | "randomUUID">
  window?: Window
  allowInternetIdentityPinAuthentication?: boolean
}

globalThis.global = globalThis

export const Provider = <T extends IdentityKitAuthType>({
  children,
  signerClientOptions = {},
  crypto = globalThis.crypto,
  window = globalThis.window,
  authType = IdentityKitAuthType.DELEGATION as T,
  realConnectDisabled,
  allowInternetIdentityPinAuthentication,
  discoverExtensionSigners = true,
  ...props
}: ProviderProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { createPromise, resolve, reject } = useCreatePromise<void>()
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev)
  }

  const { maxTimeToLive, keyType, storage, identity } =
    signerClientOptions as IdentityKitDelegationSignerClientOptions

  const { signers, featuredSigner } = useMemo(() => {
    const signersList =
      !props.signers || !props.signers.length
        ? [NFIDW, Plug, InternetIdentity, Stoic, OISY]
        : props.signers

    const selectedFeaturedSigner =
      props.featuredSigner === false ? undefined : (props.featuredSigner ?? signersList[0])

    return {
      signers: signersList,
      featuredSigner: selectedFeaturedSigner,
    }
  }, [props.signers, props.featuredSigner, signerClientOptions])

  const [discoveredSigners, setDiscoveredSigners] = useState<SignerConfig[]>([])
  useEffect(() => {
    if (!discoverExtensionSigners) {
      return
    }
    BrowserExtensionTransport.discover().then((providerDetails) => {
      setDiscoveredSigners(
        providerDetails.map((providerDetail) => ({
          id: providerDetail.uuid,
          providerUrl: "",
          label: providerDetail.name,
          transportType: TransportType.EXTENSION,
          icon: providerDetail.icon,
        }))
      )
    })
  }, [discoverExtensionSigners])

  const signersIncludingDiscovered = useMemo(
    () => [...signers, ...discoveredSigners],
    [signers, discoveredSigners]
  )

  const {
    selectSigner,
    clearSigner,
    selectedSigner,
    localStorageSigner,
    selectCustomSigner,
    setSelectedSignerToLocalStorage,
  } = useProceedSigner({
    signers: signersIncludingDiscovered,
    closeModal: () => setIsModalOpen(false),
    crypto,
    window,
    transportOptions: {
      maxTimeToLive,
      derivationOrigin: signerClientOptions.derivationOrigin,
      allowInternetIdentityPinAuthentication,
      keyType,
      storage,
      identity,
    },
  })

  const onConnectSuccess = useCallback(() => {
    setSelectedSignerToLocalStorage()
    resolve()
  }, [setSelectedSignerToLocalStorage, resolve])

  const identityKit = useCreateIdentityKit({
    selectedSigner,
    clearSigner,
    signerClientOptions: { ...signerClientOptions, crypto },
    authType,
    onConnectSuccess,
    onConnectFailure: reject,
    onDisconnect: props.onDisconnect,
    realConnectDisabled,
  })

  const isInitializing = useMemo(
    () => !!localStorageSigner && !identityKit.user,
    [localStorageSigner, identityKit.user]
  )
  const isUserConnecting = useMemo(
    () => !!selectedSigner && !identityKit.user,
    [selectedSigner, identityKit.user]
  )

  const connect = useCallback(
    async (signerIdOrUrl?: string) => {
      if (isInitializing) throw new Error("Identitykit is not initialized yet")
      if (!signerIdOrUrl) setIsModalOpen(true)
      else {
        if (signers.find((s) => s.id === signerIdOrUrl)) await selectSigner(signerIdOrUrl)
        else {
          if (!validateUrl(signerIdOrUrl))
            throw new Error("Provided value is not valid signer id or url")
          await selectCustomSigner(signerIdOrUrl)
        }
      }
      return createPromise()
        .then(() => {
          props.onConnectSuccess?.()
        })
        .catch((e) => {
          if (props.onConnectFailure) {
            props.onConnectFailure(e)
          } else {
            throw e
          }
        })
    },
    [isInitializing, signers]
  )

  return (
    <Context.Provider
      value={{
        signers: signersIncludingDiscovered,
        selectedSigner,
        isModalOpen,
        featuredSigner,
        user: identityKit.user,
        icpBalance: identityKit.icpBalance,
        authType,
        signerClient: identityKit.signerClient,
        isInitializing,
        isUserConnecting,
        toggleModal,
        selectSigner,
        selectCustomSigner,
        connect,
        disconnect: identityKit.disconnect,
        fetchIcpBalance: identityKit.fetchIcpBalance,
      }}
    >
      <ThemeProvider theme={props.theme}>
        <ConnectWalletModal />
        {children}
      </ThemeProvider>
    </Context.Provider>
  )
}
