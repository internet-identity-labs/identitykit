import { useState, useCallback, PropsWithChildren, useMemo, useEffect } from "react"
import {
  IdentityKitAuthType,
  IdentityKitDelegationSignerClientOptions,
  NFIDW,
  InternetIdentity,
} from "../../../../lib"
import {
  useCreateIdentityKit,
  useCreatePromise,
  useProceedAuthType,
  useProceedSigner,
} from "../../hooks"
import { validateUrl } from "../../utils"
import { SignerConfig, TransportType } from "../../../../lib/types"
import { ConnectWalletModal } from "../connect-wallet"
import { IdentityKitTheme } from "../../constants"
import { ThemeProvider } from "./theme-provider"
import { Context } from "../../contexts"
import { BrowserExtensionTransport } from "@slide-computer/signer-extension"
import { Transport } from "@slide-computer/signer"
import { TransportBuilder } from "../../../../lib/service"

interface ProviderProps extends PropsWithChildren {
  authType?: IdentityKitAuthType | Record<string, IdentityKitAuthType>
  signers?: SignerConfig[]
  featuredSigner?: SignerConfig | false
  discoverExtensionSigners?: boolean
  theme?: IdentityKitTheme
  signerClientOptions?: Omit<
    IdentityKitDelegationSignerClientOptions,
    "signer" | "crypto" | "agent"
  >
  onConnectFailure?: (e: Error) => unknown
  onConnectSuccess?: () => unknown
  onDisconnect?: () => unknown
  realConnectDisabled?: boolean
  crypto?: Pick<Crypto, "getRandomValues" | "randomUUID">
  window?: Window
  allowInternetIdentityPinAuthentication?: boolean
  windowOpenerFeatures?: string
  discoveredSignersIdsToExclude?: string[]
}

globalThis.global = globalThis

export const Provider = ({
  children,
  signerClientOptions = {},
  crypto = globalThis.crypto,
  window = globalThis.window,
  authType = {},
  realConnectDisabled,
  allowInternetIdentityPinAuthentication,
  discoverExtensionSigners = true,
  windowOpenerFeatures,
  discoveredSignersIdsToExclude = [],
  ...props
}: ProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { createPromise, resolve, reject } = useCreatePromise<void>()
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev)
  }
  const [transports, setTransports] = useState<Array<{ value: Transport; signerId: string }>>()
  const [transportsLoading, setTransportsLoading] = useState(false)

  const { maxTimeToLive, keyType, storage, identity } =
    signerClientOptions as IdentityKitDelegationSignerClientOptions

  const { signers, featuredSigner } = useMemo(() => {
    const signersList =
      !props.signers || !props.signers.length ? [NFIDW, InternetIdentity] : props.signers

    const selectedFeaturedSigner =
      props.featuredSigner === false ? undefined : (props.featuredSigner ?? signersList[0])

    return {
      signers: signersList,
      featuredSigner: selectedFeaturedSigner,
    }
  }, [props.signers, props.featuredSigner, signerClientOptions])

  useEffect(() => {
    if (signers.length && !transports && !transportsLoading) {
      setTransportsLoading(true)
      Promise.all(
        signers.map(async (signer) => {
          const transport = await TransportBuilder.build({
            maxTimeToLive,
            derivationOrigin: signerClientOptions.derivationOrigin,
            allowInternetIdentityPinAuthentication,
            keyType,
            storage,
            identity,
            id: signer.id,
            transportType: signer.transportType,
            url: signer.providerUrl,
            crypto,
            window,
            windowOpenerFeatures,
          })
          return {
            value: transport,
            signerId: signer.id,
          }
        })
      )
        .then(setTransports)
        .finally(() => {
          setTransportsLoading(false)
        })
    }
  }, [signers, transports, transportsLoading])

  const [discoveredSigners, setDiscoveredSigners] = useState<
    Array<{
      transport: { value: Transport; signerId: string }
      config: SignerConfig
    }>
  >([])
  useEffect(() => {
    if (!discoverExtensionSigners) {
      return
    }
    BrowserExtensionTransport.discover().then(async (providerDetails) => {
      setDiscoveredSigners(
        await Promise.all(
          providerDetails
            .filter((pD) => !discoveredSignersIdsToExclude.includes(pD.uuid))
            .map(async (providerDetail) => ({
              config: {
                id: providerDetail.uuid,
                providerUrl: "",
                label: providerDetail.name,
                transportType: TransportType.EXTENSION,
                icon: providerDetail.icon,
              },
              transport: {
                signerId: providerDetail.uuid,
                value: await TransportBuilder.build({
                  maxTimeToLive,
                  derivationOrigin: signerClientOptions.derivationOrigin,
                  allowInternetIdentityPinAuthentication,
                  keyType,
                  storage,
                  identity,
                  id: providerDetail.uuid,
                  transportType: TransportType.EXTENSION,
                  url: "",
                  crypto,
                  window,
                }),
              },
            }))
        )
      )
    })
  }, [discoverExtensionSigners])

  const signersIncludingDiscovered = useMemo(
    () => [...signers, ...discoveredSigners.map(({ config }) => config)],
    [signers, discoveredSigners]
  )
  const transportsIncludingDiscovered = useMemo(
    () => [...(transports ?? []), ...discoveredSigners.map(({ transport }) => transport)],
    [transports, discoveredSigners]
  )

  const {
    selectSigner,
    clearSigner,
    selectedSigner,
    localStorageSigner,
    selectCustomSigner,
    setSelectedSignerToLocalStorage,
    isSignerBeingSelected,
  } = useProceedSigner({
    signers: signersIncludingDiscovered,
    closeModal: () => setIsModalOpen(false),
    onConnectFailure: reject,
    crypto,
    window,
    windowOpenerFeatures,
    transports: transportsIncludingDiscovered,
  })

  const onConnectSuccess = useCallback(() => {
    setSelectedSignerToLocalStorage()
    resolve()
  }, [setSelectedSignerToLocalStorage, resolve])

  const finalAuthType = useProceedAuthType({
    customAuthType: authType,
    selectedSignerId: selectedSigner?.id,
  })

  const identityKit = useCreateIdentityKit({
    selectedSigner,
    clearSigner,
    signerClientOptions: { ...signerClientOptions, crypto },
    authType: finalAuthType,
    onConnectSuccess,
    onConnectFailure: reject,
    onDisconnect: props.onDisconnect,
    realConnectDisabled,
  })

  const isInitializing = useMemo(
    () => !transports || (!!localStorageSigner && !identityKit.user),
    [localStorageSigner, identityKit.user, transports]
  )
  const isUserConnecting = useMemo(
    () => (selectedSigner ? !identityKit.user : isSignerBeingSelected),
    [selectedSigner, identityKit.user, isSignerBeingSelected]
  )

  const connect = useCallback(
    async (signerIdOrUrl?: string) => {
      try {
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
      } catch (e) {
        if (props.onConnectFailure) {
          props.onConnectFailure(e as Error)
        } else {
          throw e
        }
      }
      return createPromise()
        .then(() => {
          props.onConnectSuccess?.()
        })
        .catch(async (e) => {
          if (props.onConnectFailure) {
            props.onConnectFailure(e)
          } else {
            throw e
          }
        })
    },
    [isInitializing, signers, selectedSigner]
  )

  return (
    <Context.Provider
      value={{
        signers: signersIncludingDiscovered,
        discoveredSigners: discoveredSigners.map(({ config }) => config),
        selectedSigner,
        isModalOpen,
        featuredSigner,
        user: identityKit.user,
        icpBalance: identityKit.icpBalance,
        authType: finalAuthType,
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
