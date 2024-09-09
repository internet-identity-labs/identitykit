import { useState, useCallback, PropsWithChildren } from "react"
import { SignerConfig } from "../../lib/types"
import { IdentityKitContext } from "./context"
import { IdentityKitModal } from "./modal"
import { IdentityKitTheme } from "./constants"
import {
  IdentityKitAuthType,
  IdentityKitAccountsSignerClientOptions,
  IdentityKitDelegationSignerClientOptions,
  IdentityKitSignerAgentOptions,
  NFIDW,
  Plug,
  InternetIdentity,
  Stoic,
} from "../../lib"
import { useCreateIdentityKit, useSigner, useTheme } from "./hooks"
import { SignerOptions, Transport } from "@slide-computer/signer"
import { Signer } from "@slide-computer/signer"

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
  agent?: IdentityKitSignerAgentOptions<Signer>["agent"]
  onConnectFailure?: (e: Error) => unknown
  onConnectSuccess?: (signerResponse: object) => unknown
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

  const signers =
    !props.signers || !props.signers.length ? [NFIDW, Plug, InternetIdentity, Stoic] : props.signers

  const { selectSigner, clearSigner, selectedSigner, selectCustomSigner } = useSigner({
    signers,
    closeModal: () => setIsModalOpen(false),
    crypto,
    options: signerOptions,
  })

  const identityKit = useCreateIdentityKit({
    selectedSigner,
    clearSigner,
    signerClientOptions: { ...signerClientOptions, crypto },
    agentOptions: {
      agent,
    },
    authType,
    onConnectSuccess: props.onConnectSuccess,
    onConnectFailure: props.onConnectFailure,
    onDisconnect: props.onDisconnect,
    realConnectDisabled,
  })

  const theme = useTheme(props.theme)

  return (
    <IdentityKitContext.Provider
      value={{
        signers,
        selectedSigner,
        isModalOpen,
        toggleModal,
        selectSigner,
        selectCustomSigner,
        theme,
        featuredSigner: featuredSigner === false ? undefined : (featuredSigner ?? signers[0]),
        agent: identityKit.agent,
        connectedAccount: identityKit.connectedAccount,
        disconnect: identityKit.disconnect,
        icpBalance: identityKit.icpBalance,
        authType,
        signerClient: identityKit.signerClient,
      }}
    >
      <IdentityKitModal />
      {children}
    </IdentityKitContext.Provider>
  )
}
