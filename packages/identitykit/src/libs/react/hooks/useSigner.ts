import { useCallback, useEffect, useState } from "react"
import { Signer } from "@slide-computer/signer"
import { PostMessageTransport } from "@slide-computer/signer-web"
import { DEFAULT_SIZES } from "../constants"
import { openPopup } from "../utils"
import { SignerConfig } from "../../../lib"

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

      const { providerUrl, label, popupWidth, popupHeight } = signer

      const width = popupWidth || DEFAULT_SIZES.width
      const height = popupHeight || DEFAULT_SIZES.height

      // TODO should have openWindow according to transport
      const transport = new PostMessageTransport({
        openWindow: () => openPopup(providerUrl, label, width, height),
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
    const transport = new PostMessageTransport({
      openWindow: () => openPopup(url, "Custom", 450, 640),
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
