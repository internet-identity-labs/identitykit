import { useState, useCallback, PropsWithChildren, useMemo } from "react"
import {
  IdentityKitAuthType,
  IdentityKitAccountsSignerClientOptions,
  IdentityKitDelegationSignerClientOptions,
  NFIDW,
  Plug,
  InternetIdentity,
  Stoic,
  PrimeVault,
} from "../../../../lib"
import { useCreateIdentityKit, useProceedSigner } from "../../hooks"
import { validateUrl } from "../../utils"
import { SignerConfig } from "../../../../lib/types"
import { ConnectWalletModal } from "../connect-wallet"
import { IdentityKitTheme } from "../../constants"
import { ThemeProvider } from "./theme-provider"
import { Context } from "../../contexts"

interface ProviderProps<T extends IdentityKitAuthType = typeof IdentityKitAuthType.ACCOUNTS>
  extends PropsWithChildren {
  authType?: T
  signers?: SignerConfig[]
  featuredSigner?: SignerConfig | false
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
  ...props
}: ProviderProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev)
  }

  const { maxTimeToLive, keyType, storage, identity } =
    signerClientOptions as IdentityKitDelegationSignerClientOptions

  const { signers, featuredSigner } = useMemo(() => {
    const signersList =
      !props.signers || !props.signers.length
        ? [NFIDW, Plug, InternetIdentity, PrimeVault, Stoic]
        : props.signers

    const selectedFeaturedSigner =
      props.featuredSigner === false ? undefined : (props.featuredSigner ?? signersList[0])

    return {
      signers: signersList,
      featuredSigner: selectedFeaturedSigner,
    }
  }, [props.signers, props.featuredSigner, signerClientOptions])

  const {
    selectSigner,
    clearSigner,
    selectedSigner,
    localStorageSigner,
    selectCustomSigner,
    setSelectedSignerToLocalStorage,
  } = useProceedSigner({
    signers,
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
    props.onConnectSuccess?.()
  }, [setSelectedSignerToLocalStorage, props.onConnectSuccess])

  const identityKit = useCreateIdentityKit({
    selectedSigner,
    clearSigner,
    signerClientOptions: { ...signerClientOptions, crypto },
    authType,
    onConnectSuccess,
    onConnectFailure: props.onConnectFailure,
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
    (signerIdOrUrl?: string) => {
      if (isInitializing) throw new Error("Identitykit is not initialized yet")
      if (!signerIdOrUrl) setIsModalOpen(true)
      else {
        if (signers.find((s) => s.id === signerIdOrUrl)) selectSigner(signerIdOrUrl)
        else {
          if (!validateUrl(signerIdOrUrl))
            throw new Error("Provided value is not valid signer id or url")
          selectCustomSigner(signerIdOrUrl)
        }
      }
    },
    [isInitializing, signers]
  )

  return (
    <Context.Provider
      value={{
        signers,
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
