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
} from "../../lib"
import { useCreateIdentityKit, useLogoutOnIdle, useSigner, useTheme } from "./hooks"

interface IdentityKitProviderProps<
  T extends IdentityKitAuthType = typeof IdentityKitAuthType.ACCOUNTS,
> extends PropsWithChildren {
  authType?: T
  signers?: SignerConfig[]
  featuredSigner?: SignerConfig | false
  theme?: IdentityKitTheme
  signerClientOptions?: T extends typeof IdentityKitAuthType.DELEGATION
    ? Omit<IdentityKitDelegationSignerClientOptions, "signer">
    : Omit<IdentityKitAccountsSignerClientOptions, "signer">
  agentOptions?: {
    signer?: IdentityKitSignerAgentOptions["signer"]
    agent?: IdentityKitSignerAgentOptions["agent"]
  }
}

globalThis.global = globalThis

export const IdentityKitProvider = <T extends IdentityKitAuthType>({
  children,
  signerClientOptions,
  agentOptions,
  authType,
  featuredSigner,
  ...props
}: IdentityKitProviderProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev)
  }, [])

  const signers = !props.signers || !props.signers.length ? [NFIDW, Plug] : props.signers

  const { selectSigner, selectedSigner, savedSigner, selectCustomSigner } = useSigner({
    signers,
    closeModal: () => setIsModalOpen(false),
  })

  const { shouldLogoutByIdle, logoutByIdle } = useLogoutOnIdle()

  const { signerClient, setSignerClient } = useCreateIdentityKit({
    selectedSigner: selectedSigner ?? savedSigner,
    signerClientOptions: {
      ...signerClientOptions,
      idleOptions: {
        ...signerClientOptions?.idleOptions,
        onIdle: () => {
          signerClientOptions?.idleOptions?.onIdle?.()
          logoutByIdle()
        },
      },
    },
    agentOptions,
    authType,
  })

  const theme = useTheme(props.theme)

  return (
    <IdentityKitContext.Provider
      value={{
        signers,
        selectedSigner,
        savedSigner,
        isModalOpen,
        toggleModal,
        selectSigner,
        selectCustomSigner,
        theme,
        featuredSigner: featuredSigner === false ? undefined : (featuredSigner ?? signers[0]),
        agentOptions,
        signerClient,
        setSignerClient,
        shouldLogoutByIdle,
      }}
    >
      <IdentityKitModal />
      {children}
    </IdentityKitContext.Provider>
  )
}
