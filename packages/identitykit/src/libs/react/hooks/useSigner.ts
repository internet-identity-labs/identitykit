import { useCallback, useEffect, useState } from "react"
import { Signer, SignerOptions } from "@slide-computer/signer"
import { TransportBuilder } from "../../../lib/service"
import { TransportType, SignerConfig } from "../../../lib/types"

export function useSigner({
  signers,
  closeModal,
  crypto,
  ...props
}: {
  signers: SignerConfig[]
  closeModal: () => unknown
  options: Pick<SignerOptions, "autoCloseTransportChannel" | "closeTransportChannelAfter">
  crypto?: Pick<Crypto, "getRandomValues" | "randomUUID">
}) {
  const [selectedSigner, setSelectedSigner] = useState<Signer | undefined>(undefined)
  const [prevSigner, setPrevSigner] = useState<Signer | undefined>(undefined)

  const options = { ...(props.options ?? {}), crypto }

  const selectSigner = useCallback(
    (cb: (signer?: Signer) => unknown, signerId?: string) => {
      if (!signerId) {
        localStorage.removeItem("signerId")
        return cb(undefined)
      }

      const signer = signers.find((s) => s.id === signerId)
      if (!signer) throw new Error(`Signer with id ${signerId} not found`)

      const { transportType, providerUrl } = signer

      const transport = TransportBuilder.build({
        id: signer.id,
        transportType,
        url: providerUrl,
        crypto,
      })

      const createdSigner = new Signer({
        ...options,
        transport,
      })
      cb(createdSigner)

      localStorage.setItem("signerId", signerId)
      closeModal()

      return signer
    },
    [signers, selectedSigner, closeModal]
  )

  const selectCustomSigner = useCallback((url: string) => {
    const transport = TransportBuilder.build({
      transportType: TransportType.NEW_TAB,
      url,
      crypto,
    })

    const createdSigner = new Signer({ ...options, transport })

    setSelectedSigner(createdSigner)
    closeModal()
  }, [])

  // default selected signer from local storage
  useEffect(() => {
    if (!selectedSigner && localStorage.getItem("signerId") && !prevSigner)
      selectSigner(setPrevSigner, localStorage.getItem("signerId")!)
  }, [selectedSigner, selectSigner, setPrevSigner, prevSigner])

  return {
    selectSigner: (signerId?: string) => {
      selectSigner(setSelectedSigner, signerId)
    },
    // clear both signer and local storage signer
    clearSigner: () => {
      selectSigner(setSelectedSigner)
      selectSigner(setPrevSigner)
    },
    selectCustomSigner,
    // selected signer is local storage signer by default (in case authenticated user)
    selectedSigner: selectedSigner ?? prevSigner,
  }
}
