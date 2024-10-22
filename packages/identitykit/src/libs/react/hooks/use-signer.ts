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
  const [selectedSigner, setSelectedSigner] = useState<Signer | undefined>(undefined)
  const [prevSigner, setPrevSigner] = useState<Signer | undefined>(undefined)

  const selectSigner = useCallback(
    async (cb: (signer?: Signer) => unknown, signerId?: string) => {
      if (!signerId) {
        localStorage.removeItem("signerId")
        return cb(undefined)
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
      cb(createdSigner)

      localStorage.setItem("signerId", signerId)
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

    setSelectedSigner(createdSigner)
    closeModal()
  }, [])

  // default selected signer from local storage
  useEffect(() => {
    async function select() {
      if (!selectedSigner && localStorage.getItem("signerId") && !prevSigner)
        await selectSigner(setPrevSigner, localStorage.getItem("signerId")!)
    }

    select()
  }, [selectedSigner, selectSigner, setPrevSigner, prevSigner])

  return {
    selectSigner: async (signerId?: string) => {
      await selectSigner(setSelectedSigner, signerId)
    },
    // clear both signer and local storage signer
    clearSigner: async () => {
      await selectSigner(setSelectedSigner)
      await selectSigner(setPrevSigner)
    },
    selectCustomSigner,
    // selected signer is local storage signer by default (in case authenticated user)
    selectedSigner: selectedSigner ?? prevSigner,
  }
}
