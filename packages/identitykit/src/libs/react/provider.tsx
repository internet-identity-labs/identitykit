import { useState, useCallback, PropsWithChildren, useEffect, useMemo } from "react"
import { SignerOptions, Transport } from "@slide-computer/signer"
import { HttpAgent } from "@dfinity/agent"
import {
  IdentityKitAuthType,
  IdentityKitAccountsSignerClientOptions,
  IdentityKitDelegationSignerClientOptions,
  NFIDW,
  Plug,
  InternetIdentity,
  Stoic,
} from "../../lib"
import { useCreateIdentityKit, useSigner, useTheme } from "./hooks"
import { TransportBuilder } from "../../lib/service"
import { SignerConfig } from "../../lib/types"
import { IdentityKitContext } from "./context"
import { IdentityKitModal } from "./modal"
import { IdentityKitTheme } from "./constants"

interface IdentityKitProviderProps<
  T extends IdentityKitAuthType = typeof IdentityKitAuthType.ACCOUNTS,
> extends PropsWithChildren {
  authType?: T
  signers?: SignerConfig[]
  featuredSigner?: SignerConfig | false
  theme?: IdentityKitTheme
  signerClientOptions?: T extends typeof IdentityKitAuthType.DELEGATION
    ? Omit<IdentityKitDelegationSignerClientOptions, "signer" | "crypto">
    : Omit<IdentityKitAccountsSignerClientOptions, "signer" | "crypto">
  signerOptions?: Pick<
    SignerOptions<Transport>,
    "autoCloseTransportChannel" | "closeTransportChannelAfter"
  >
  agent?: HttpAgent
  onConnectFailure?: (e: Error) => unknown
  onConnectSuccess?: () => unknown
  onDisconnect?: () => unknown
  realConnectDisabled?: boolean
  crypto?: Pick<Crypto, "getRandomValues" | "randomUUID">
}

globalThis.global = globalThis

export const IdentityKitProvider = <T extends IdentityKitAuthType>({
  children,
  signerClientOptions = {},
  signerOptions = {},
  crypto = globalThis.crypto,
  agent,
  authType = IdentityKitAuthType.ACCOUNTS as T,
  featuredSigner,
  realConnectDisabled,
  ...props
}: IdentityKitProviderProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev)
  }, [])
  const [transports, setTransports] = useState<
    Array<{ transport: Transport; signerId: string }> | undefined
  >()

  const signers =
    !props.signers || !props.signers.length ? [NFIDW, Plug, InternetIdentity, Stoic] : props.signers

  useEffect(() => {
    Promise.all(
      signers.map(async (s) => {
        return {
          transport: await TransportBuilder.build({
            id: s.id,
            transportType: s.transportType,
            url: s.providerUrl,
            crypto,
            maxTimeToLive: (signerClientOptions as IdentityKitDelegationSignerClientOptions)
              .maxTimeToLive,
            derivationOrigin: signerClientOptions.derivationOrigin,
          }),
          signerId: s.id,
        }
      })
    ).then(setTransports)
  }, [signers])

  const { selectSigner, clearSigner, selectedSigner, selectCustomSigner } = useSigner({
    signers,
    transports,
    closeModal: () => setIsModalOpen(false),
    crypto,
    options: signerOptions,
  })

  const identityKit = useCreateIdentityKit({
    selectedSigner,
    clearSigner,
    signerClientOptions: { ...signerClientOptions, crypto },
    agent,
    authType,
    onConnectSuccess: props.onConnectSuccess,
    onConnectFailure: props.onConnectFailure,
    onDisconnect: props.onDisconnect,
    realConnectDisabled,
  })

  const isInitializing = useMemo(() => !transports?.length, [transports])
  const isUserConnecting = useMemo(
    () => !!selectedSigner && !identityKit.user,
    [selectedSigner, identityKit.user]
  )

  const connect = useCallback(() => {
    if (isInitializing) throw new Error("Identitykit is not initialized yet")
    if (isUserConnecting) throw new Error("User is connecting")
    if (identityKit.user) {
      throw new Error("User is already connected")
    }
    setIsModalOpen(true)
  }, [setIsModalOpen, isInitializing, isUserConnecting, identityKit.user])

  const theme = useTheme(props.theme)

  return (
    <IdentityKitContext.Provider
      value={{
        signers,
        selectedSigner,
        isModalOpen,
        theme,
        featuredSigner: featuredSigner === false ? undefined : (featuredSigner ?? signers[0]),
        agent,
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
      <IdentityKitModal />
      {children}
    </IdentityKitContext.Provider>
  )
}
