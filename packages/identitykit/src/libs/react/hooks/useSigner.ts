import { useCallback, useEffect, useState } from "react"
import { Signer } from "@slide-computer/signer"
import { DEFAULT_SIZES } from "../constants"
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

      const { transportType, providerUrl, label, popupWidth, popupHeight } = signer

      const width = popupWidth || DEFAULT_SIZES.width
      const height = popupHeight || DEFAULT_SIZES.height

      const transport = TransportBuilder.build({
        transportType,
        url: providerUrl,
        label,
        width,
        height,
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
      label: "Custom",
      width: 450,
      height: 640,
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
