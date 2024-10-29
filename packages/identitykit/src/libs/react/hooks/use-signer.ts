import { useCallback, useEffect, useState } from "react"
import { Signer, Transport } from "@slide-computer/signer"
import { TransportBuilder } from "../../../lib/service"
import { TransportType, SignerConfig } from "../../../lib/types"

export function useSigner({
  signers,
  transports,
  closeModal,
  crypto,
  window,
}: {
  signers: SignerConfig[]
  transports?: Array<{ transport: Transport; signerId: string }>
  closeModal: () => unknown
  crypto?: Pick<Crypto, "getRandomValues" | "randomUUID">
  window?: Window
}) {
  // saved to local storage for next js (localStorage is not defined during server render)
  const [localStorageSigner, setLocalStorageSigner] = useState<string | undefined>()
  const [selectedSigner, setSelectedSigner] = useState<
    { signer: Signer<Transport>; signerId?: string } | undefined
  >(undefined)

  const selectSigner = useCallback(
    async (signerId?: string) => {
      if (!signerId) {
        localStorage.removeItem("signerId")
        return setSelectedSigner(undefined)
      }

      const signer = signers.find((s) => s.id === signerId)
      if (!signer) throw new Error(`Signer with id ${signerId} not found`)

      const transport = transports?.find((t) => t.signerId === signerId)

      if (!transport) return

      if (!transport?.transport.connection?.connected) {
        await transport?.transport.connection?.connect()
      }

      const createdSigner = new Signer({
        crypto,
        transport: transport!.transport,
      })

      setSelectedSigner({ signer: createdSigner, signerId })

      closeModal()

      return signer
    },
    [signers, selectedSigner, closeModal]
  )

  const selectCustomSigner = useCallback(async (url: string) => {
    const transport = await TransportBuilder.build({
      transportType: TransportType.NEW_TAB,
      url,
      crypto,
      window,
    })

    const createdSigner = new Signer({ crypto, transport })

    setSelectedSigner({ signer: createdSigner })
    closeModal()
  }, [])

  // default selected signer from local storage
  useEffect(() => {
    const storageSigner = localStorage.getItem("signerId")
    if (!selectedSigner && storageSigner) {
      setLocalStorageSigner(storageSigner)
      selectSigner(storageSigner)
    }
  }, [selectedSigner, selectSigner])

  return {
    selectSigner,
    setSelectedSignerToLocalStorage: useCallback(() => {
      if (selectedSigner && selectedSigner.signerId)
        localStorage.setItem("signerId", selectedSigner.signerId)
    }, [selectedSigner]),
    // clears both local state and local storage
    clearSigner: async () => {
      await selectSigner()
    },
    selectCustomSigner,
    // selected signer is local storage signer by default (in case authenticated user)
    selectedSigner: selectedSigner?.signer,
    // signer id in localStorage (used on connected user page reload)
    localStorageSigner,
  }
}
