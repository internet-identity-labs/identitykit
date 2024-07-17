import React, { useState, useCallback, PropsWithChildren, useEffect } from "react"
import { SignerConfig } from "../../lib/types"
import { IdentityKitContext } from "./context"
import { IdentityKitModal } from "./modal"
import { DEFAULT_SIZES, IdentityKitTheme } from "./constants"
import { PostMessageTransport } from "@slide-computer/signer-web"
import { Signer } from "@slide-computer/signer"
import { IdentityKit, IdentityKitSignerClient, IdentityKitSignerClientOptions } from "../../lib"
import { openPopup } from "./utils/openPopup"

interface IdentityKitProviderProps extends PropsWithChildren {
  signers: SignerConfig[]
  theme?: IdentityKitTheme
  signerClientOptions?: Omit<IdentityKitSignerClientOptions, "signer">
}

globalThis.global = globalThis

export const IdentityKitProvider: React.FC<IdentityKitProviderProps> = ({
  children,
  signers,
  theme = IdentityKitTheme.SYSTEM,
  signerClientOptions = {},
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSigner, setSelectedSigner] = useState<Signer | undefined>(undefined)
  const [identityKit, setIdentityKit] = useState<null | IdentityKit>(null)

  const createIdentityKitSignerClient = useCallback(async () => {
    if (selectedSigner)
      return await IdentityKitSignerClient.create({
        signer: selectedSigner,
        keyType: "Ed25519",
        ...signerClientOptions,
      })
    return null
  }, [selectedSigner])

  const createIdentityKit = useCallback(async () => {
    const signerClient = await createIdentityKitSignerClient()
    if (signerClient !== null) return new IdentityKit(signerClient)
    return null
  }, [createIdentityKitSignerClient])

  useEffect(() => {
    createIdentityKit().then(setIdentityKit)
  }, [createIdentityKit])

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev)
  }, [])

  const selectSigner = useCallback(
    (signerId?: string) => {
      if (typeof signerId === "undefined") return setSelectedSigner(undefined)
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
      setSelectedSigner(createdSigner)
      setIsModalOpen(false)

      return signer
    },
    [signers, selectedSigner, setIsModalOpen]
  )

  const setCustomSigner = useCallback((url: string) => {
    const transport = new PostMessageTransport({
      openWindow: () => openPopup(url, "Custom", 450, 640),
    })

    const createdSigner = new Signer({ transport })

    setSelectedSigner(createdSigner)
    setIsModalOpen(false)
  }, [])
  // theme inherits from system by default
  const ctxTheme =
    theme === IdentityKitTheme.SYSTEM
      ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? IdentityKitTheme.DARK
        : IdentityKitTheme.LIGHT
      : theme

  return (
    <IdentityKitContext.Provider
      value={{
        signers,
        selectedSigner,
        isModalOpen,
        toggleModal,
        selectSigner,
        setCustomSigner,
        theme: ctxTheme,
        identityKit: identityKit!,
      }}
    >
      <IdentityKitModal />
      {children}
    </IdentityKitContext.Provider>
  )
}
