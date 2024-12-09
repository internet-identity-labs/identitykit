import { useCallback, useEffect, useMemo, useState } from "react"
import { Signer, Transport } from "@slide-computer/signer"
import { TransportBuilder } from "../../../lib/service"
import { TransportType, SignerConfig } from "../../../lib/types"
import { TransportBuilderRequest } from "../../../lib/service/transport-builder/transport.builder"

export function useProceedSigner({
  signers,
  closeModal,
  crypto,
  window,
  transportOptions,
}: {
  signers: SignerConfig[]
  closeModal: () => unknown
  crypto?: Pick<Crypto, "getRandomValues" | "randomUUID">
  window?: Window
  transportOptions: Pick<
    TransportBuilderRequest,
    | "maxTimeToLive"
    | "derivationOrigin"
    | "allowInternetIdentityPinAuthentication"
    | "keyType"
    | "identity"
    | "storage"
  >
}) {
  // saved to local storage for next js (localStorage is not defined during server render)
  const [localStorageSigner, setLocalStorageSigner] = useState<string | undefined>(
    (typeof window !== "undefined" && localStorage.getItem("signerId")) || ""
  )
  const [selectedSigner, setSelectedSigner] = useState<
    { signer: Signer<Transport>; signerId?: string } | undefined
  >(undefined)

  const selectSigner = useCallback(
    async (signerId?: string) => {
      if (!signerId) {
        localStorage.removeItem("signerId")
        setLocalStorageSigner(undefined)
        return setSelectedSigner(undefined)
      }

      const signer = signers.find((s) => s.id === signerId)
      if (!signer) throw new Error(`Signer with id ${signerId} not found`)

      const transport = await TransportBuilder.build({
        ...transportOptions,
        id: signer.id,
        transportType: signer.transportType,
        url: signer.providerUrl,
        crypto,
        window,
      })

      if (!transport.connection?.connected) {
        await transport.connection?.connect()
      }

      const createdSigner = new Signer({
        crypto,
        transport,
      })

      setSelectedSigner({ signer: createdSigner, signerId })

      closeModal()

      return signer
    },
    [signers, crypto, closeModal]
  )

  const selectCustomSigner = useCallback(
    async (url: string) => {
      const transport = await TransportBuilder.build({
        transportType: TransportType.NEW_TAB,
        url,
        crypto,
        window,
      })

      const createdSigner = new Signer({ crypto, transport })

      setSelectedSigner({ signer: createdSigner })
      closeModal()
    },
    [crypto, window, closeModal]
  )

  // default selected signer from local storage
  useEffect(() => {
    // for next.js, where localStorage is not available during ssr
    const lsSigner = localStorage.getItem("signerId")
    if (!selectedSigner && lsSigner) {
      selectSigner(lsSigner)
    }
  }, [selectedSigner, selectSigner])

  const setSelectedSignerToLocalStorage = useCallback(() => {
    if (selectedSigner && selectedSigner.signerId) {
      localStorage.setItem("signerId", selectedSigner.signerId)
    }
  }, [selectedSigner])

  const memoizedSelectedSigner = useMemo(() => selectedSigner?.signer, [selectedSigner])

  return {
    selectSigner,
    setSelectedSignerToLocalStorage,
    // clears both local state and local storage
    clearSigner: () => selectSigner(),
    selectCustomSigner,
    // selected signer is local storage signer by default (in case authenticated user)
    selectedSigner: memoizedSelectedSigner,
    // signer id in localStorage (used on connected user page reload)
    localStorageSigner,
  }
}
