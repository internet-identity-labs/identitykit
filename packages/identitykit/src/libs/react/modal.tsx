import { useContext, useEffect, useMemo, useState } from "react"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { IdentityKitContext } from "./context"
import { ModalHeader } from "./components/modal-header"
import { SelectWalletList } from "./components/select-wallet-list"
import useClickOutside from "./hooks/use-click-outside"

export const IdentityKitModal = () => {
  const ctx = useContext(IdentityKitContext)

  if (!ctx) {
    throw new Error("Identitykit Context is null")
  }

  const { isModalOpen, toggleModal, signers, selectSigner, theme, featuredSigner } = ctx

  const [isViewAll, setIsViewAll] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => {
    isModalOpen && toggleModal()
  })

  useEffect(() => {
    setTimeout(() => {
      if (!isModalOpen) {
        document.body.removeAttribute("data-scroll-locked")
      }
      document.body.style.pointerEvents = isModalOpen ? "none" : ""
      document.body.style.userSelect = isModalOpen ? "none" : ""
      document.body.style.overflow = isModalOpen ? "hidden" : ""
    }, 0)
  }, [isModalOpen])

  const sortedSigners = useMemo(() => {
    return signers.sort((a, b) => {
      if (a.id === featuredSigner?.id) return -1
      if (b.id === featuredSigner?.id) return 1
      return 0
    })
  }, [signers, featuredSigner])

  return (
    <TooltipProvider>
      <Dialog.Root open={true}>
        <Dialog.Portal>
          <div
            className={clsx(
              isModalOpen ? "ik-block" : "ik-hidden",
              "ik-component ik-bg-black ik-bg-opacity-25 ik-backdrop-blur-[2px]",
              "ik-fixed ik-inset-0 ik-z-[1009]"
            )}
          />
          <Dialog.Content
            ref={ref}
            id="ik-identity-kit-modal"
            data-identity-kit-theme={theme}
            aria-describedby={undefined}
            className={clsx(
              "ik-component ik-flex-col ik-fixed ik-p-0 focus:ik-outline-none ik-z-[1010]",
              "ik-shadow-lg",
              "ik-top-[50%] ik-left-[50%] ik-max-h-[85vh] ik-w-[90vw] ik-max-w-[490px] ik-translate-x-[-50%] ik-translate-y-[-50%]",
              isModalOpen ? "ik-flex" : "ik-hidden"
            )}
          >
            <Dialog.Title className="ik-hidden">Select signer</Dialog.Title>
            <div
              className={clsx(
                "ik-flex ik-flex-col ik-rounded-xl ik-h-full",
                "ik-bg-[#FAFAFA] dark:ik-bg-black",
                "ik-p-[20px] ik-gap-[10px]"
              )}
            >
              <ModalHeader onBack={() => setIsViewAll(false)} isViewAll={isViewAll} />
              <SelectWalletList
                signers={sortedSigners}
                featuredSigner={featuredSigner}
                onSelectSigner={selectSigner}
                isViewAll={isViewAll}
                onViewAll={() => setIsViewAll(true)}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </TooltipProvider>
  )
}
