import { useCallback, useEffect, useState } from "react"
import { Signer, Transport } from "@slide-computer/signer"
import { TransportBuilder } from "../../../lib/service"
import { TransportType, SignerConfig } from "../../../lib/types"

export function useProceedSigner({
  signers,
  transports,
  closeModal,
  crypto,
  window,
  windowOpenerFeatures,
  onConnectFailure,
}: {
  signers: SignerConfig[]
  transports?: Array<{ value: Transport; signerId: string }>
  closeModal: () => unknown
  crypto?: Pick<Crypto, "getRandomValues" | "randomUUID">
  window?: Window
  windowOpenerFeatures?: string
  onConnectFailure?: (e: Error) => unknown
}) {
  // saved to local storage for next js (localStorage is not defined during server render)
  const [localStorageSigner, setLocalStorageSigner] = useState<string | undefined>(
    (typeof window !== "undefined" && localStorage.getItem("signerId")) || ""
  )
  const [selectedSigner, setSelectedSigner] = useState<
    { value: Signer<Transport>; id: string } | undefined
  >(undefined)
  const [isSignerBeingSelected, setIsSignerBeingSelected] = useState(false)

  const selectSigner = useCallback(
    async (signerId?: string) => {
      if (!signerId) {
        localStorage.removeItem("signerId")
        setLocalStorageSigner(undefined)
        return setSelectedSigner(undefined)
      }

      try {
        setIsSignerBeingSelected(true)
        closeModal()

        const signerConfig = signers.find((s) => s.id === signerId)
        if (!signerConfig) throw new Error(`Signer with id ${signerId} not found`)

        const transport = transports?.find((t) => t.signerId === signerId)?.value

        if (!transport) throw new Error("Transport was not found")

        if (!transport.connection?.connected && !localStorageSigner) {
          await transport.connection?.connect()
        }

        const createdSigner = new Signer({
          crypto,
          transport,
        })

        setSelectedSigner({ value: createdSigner, id: signerId })

        setIsSignerBeingSelected(false)
      } catch (e) {
        setIsSignerBeingSelected(false)
        onConnectFailure?.(e as Error)
        return
      }
    },
    [signers, crypto, closeModal, transports, localStorageSigner]
  )

  const selectCustomSigner = useCallback(
    async (url: string) => {
      const transport = await TransportBuilder.build({
        transportType: TransportType.NEW_TAB,
        url,
        crypto,
        window,
        windowOpenerFeatures,
      })

      const signer = new Signer({ crypto, transport })

      setSelectedSigner({ value: signer, id: url })
      closeModal()
    },
    [crypto, window, closeModal, windowOpenerFeatures]
  )

  // default selected signer from local storage
  useEffect(() => {
    // for next.js, where localStorage is not available during ssr
    const lsSigner = localStorage.getItem("signerId")
    if (!selectedSigner && lsSigner && transports) {
      selectSigner(lsSigner)
    }
  }, [selectedSigner, selectSigner, transports])

  const setSelectedSignerToLocalStorage = useCallback(() => {
    if (selectedSigner && selectedSigner?.id) {
      localStorage.setItem("signerId", selectedSigner?.id)
    }
  }, [selectedSigner])

  return {
    selectSigner,
    setSelectedSignerToLocalStorage,
    // clears both local state and local storage
    clearSigner: () => selectSigner(),
    selectCustomSigner,
    // selected signer is local storage signer by default (in case authenticated user)
    selectedSigner,
    // signer id in localStorage (used on connected user page reload)
    localStorageSigner,
    isSignerBeingSelected,
  }
}
