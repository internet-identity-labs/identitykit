import { useCallback, useEffect, useState } from "react"
import { Signer } from "@slide-computer/signer"
import { SignerConfig } from "../../../lib"
import { TransportBuilder } from "../../../lib/service"
import { TransportType } from "../../../lib/types"

export function useSigner({
  signers,
  closeModal,
}: {
  signers: SignerConfig[]
  closeModal: () => unknown
}) {
  const [selectedSigner, setSelectedSigner] = useState<Signer | undefined>(undefined)
  const [prevSigner, setPrevSigner] = useState<Signer | undefined>(undefined)

  const selectSigner = useCallback(
    (cb: (signer: Signer) => unknown, signerId?: string) => {
      if (!signerId) {
        localStorage.removeItem("signerId")
        return setSelectedSigner(undefined)
      }

      const signer = signers.find((s) => s.id === signerId)
      if (!signer) throw new Error(`Signer with id ${signerId} not found`)

      const { transportType, providerUrl } = signer

      const transport = TransportBuilder.build({
        transportType,
        url: providerUrl,
      })

      const createdSigner = new Signer({ transport })
      cb(createdSigner)

      localStorage.setItem("signerId", signerId)
      closeModal()

      return signer
    },
    [signers, selectedSigner, closeModal]
  )

  const selectCustomSigner = useCallback((url: string) => {
    const transport = TransportBuilder.build({
      transportType: TransportType.POPUP,
      url,
    })

    const createdSigner = new Signer({ transport })

    setSelectedSigner(createdSigner)
    closeModal()
  }, [])

  // default selected signer from local storage
  useEffect(() => {
    if (!selectedSigner && localStorage.getItem("signerId") && !prevSigner)
      selectSigner(setPrevSigner, localStorage.getItem("signerId")!)
  }, [selectedSigner, selectSigner, setPrevSigner, prevSigner])

  return {
    selectSigner: (signerId?: string) => selectSigner(setSelectedSigner, signerId),
    selectCustomSigner,
    selectedSigner,
    savedSigner: prevSigner,
  }
}
