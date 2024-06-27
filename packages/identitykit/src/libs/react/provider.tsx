import React, { useState, useCallback, PropsWithChildren } from "react"
import { SignerConfig } from "../../lib/types"
import { IdentityKitContext } from "./context"
import { IdentityKitModal } from "./modal"
import { IdentityKitTheme } from "./constants"
import { PostMessageTransport } from "@slide-computer/signer-web"
import { Signer } from "@slide-computer/signer"

interface IdentityKitProviderProps extends PropsWithChildren {
  signers: SignerConfig[]
  theme?: IdentityKitTheme
}

globalThis.global = globalThis

const openPopup = (url: string, windowName: string, width: number, height: number) => {
  const y = window.top!.outerHeight / 2 + window.top!.screenY - height / 2
  const x = window.top!.outerWidth / 2 + window.top!.screenX - width / 2
  return window.open(
    url,
    windowName,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${y}, left=${x}`
  ) as Window
}

export const IdentityKitProvider: React.FC<IdentityKitProviderProps> = ({
  children,
  signers,
  theme = IdentityKitTheme.SYSTEM,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSigner, setSelectedSigner] = useState<Signer | undefined>(undefined)

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev)
  }, [])

  const selectSigner = useCallback(
    (signerId?: string) => {
      if (typeof signerId === "undefined") return setSelectedSigner(undefined)
      const signer = signers.find((s) => s.id === signerId)
      if (!signer) throw new Error(`Signer with id ${signerId} not found`)

      // TODO should have openWindow according to transport
      const transport = new PostMessageTransport({
        openWindow: () => openPopup(signer.providerUrl, signer.label, 450, 640),
      })
      const createdSigner = new Signer({ transport })
      setSelectedSigner(createdSigner)
      setIsModalOpen(false)

      return signer
    },
    [signers, selectedSigner, setIsModalOpen]
  )

  return (
    <IdentityKitContext.Provider
      value={{
        signers,
        selectedSigner,
        isModalOpen,
        toggleModal,
        selectSigner,
      }}
    >
      <IdentityKitModal theme={theme} />
      {children}
    </IdentityKitContext.Provider>
  )
}
