import { useContext, useEffect, useMemo, useState } from "react"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { IdentityKitContext } from "./context"
import { ModalHeader } from "./components/modal-header"
import { SelectWalletList } from "./components/select-wallet-list"
import "./modal.css"

export const IdentityKitModal = () => {
  const { isModalOpen, signers, selectSigner, theme, featuredSigner } =
    useContext(IdentityKitContext)

  const [isViewAll, setIsViewAll] = useState(false)

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
              isModalOpen ? "block" : "hidden",
              "bg-black bg-opacity-25 backdrop-blur-[2px]",
              "fixed inset-0 z-[1009]"
            )}
          />
          <Dialog.Content
            id="identity-kit-modal"
            data-identity-kit-theme={theme}
            aria-describedby={undefined}
            className={clsx(
              "flex-col fixed p-0 focus:outline-none z-[1010]",
              "shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]",
              "top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[490px] translate-x-[-50%] translate-y-[-50%]",
              isModalOpen ? "flex" : "hidden"
            )}
          >
            <div
              className={clsx(
                "flex flex-col rounded-xl h-full",
                "bg-[#FAFAFA] dark:bg-black",
                "p-[20px] gap-[10px]"
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
