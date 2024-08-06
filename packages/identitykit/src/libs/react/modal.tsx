import { useContext, useEffect, useState } from "react"
import { IdentityKitContext } from "./context"
import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { Button } from "./ui/button"
import InfoIcon from "./assets/info.svg"
import BackIcon from "./assets/back.svg"

import { Tooltip } from "./ui/tooltip"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { SignerInput } from "./signer-input"
import { VisuallyHidden } from "@radix-ui/themes"

export const IdentityKitModal = () => {
  const { isModalOpen, selectedSigner, signers, selectSigner, theme } =
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

  return (
    <TooltipProvider>
      <Dialog.Root open={true}>
        <Dialog.Portal>
          <div
            className={`${isModalOpen ? "block" : "hidden"} bg-black bg-opacity-25 backdrop-blur-[2px] fixed inset-0 z-[1009]`}
          />
          <Dialog.Content
            id="identity-kit-modal"
            data-identity-kit-theme={theme}
            aria-describedby={undefined}
            className={clsx(
              { flex: isModalOpen, hidden: !isModalOpen },
              {
                "top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%]":
                  !selectedSigner,
                "top-0 left-0 h-screen w-screen": selectedSigner,
              },
              ` flex-col fixed p-0 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[1010]`
            )}
          >
            <VisuallyHidden>
              <Dialog.Title />
            </VisuallyHidden>
            <div className="h-full">
              <div className="p-[30px] bg-[#FAFAFA] dark:bg-black gap-[10px] flex flex-col rounded-xl">
                <div className="flex items-center justify-between mb-[10px]">
                  <div className="text-xl font-bold text-black dark:text-white">
                    {!isViewAll ? (
                      "Connect your wallet"
                    ) : (
                      <div className="flex items-center gap-[10px]">
                        <img
                          className="cursor-pointer"
                          onClick={() => setIsViewAll(false)}
                          src={BackIcon}
                        />
                        All wallets
                      </div>
                    )}
                  </div>
                  <Tooltip
                    align="end"
                    side="bottom"
                    tip={
                      <div className="twxt-white leading-[16px]">
                        <div className="text-sm font-bold">What is a Wallet?</div>
                        <div className="text-xs font-bold mt-[12px]">A home for digital assets</div>
                        <p className="text-xs">
                          Wallets are used to send, receive, store, and display digital assets.
                        </p>
                        <div className="text-xs font-bold mt-[12px]">A new way to sign in</div>
                        <p className="text-xs">
                          Instead of creating new accounts and passwords on every website, just
                          connect your wallet instead.
                        </p>
                      </div>
                    }
                    className="!px-[15px] !py-[18px] !px-3 bg-black z-30 w-[320px] z-[1011] mr-[-15px]"
                  >
                    <img className="cursor-pointer" src={InfoIcon} />
                  </Tooltip>
                </div>
                {signers.map((signer) => (
                  <div
                    id={`signer_${signer.id}`}
                    key={`signer_${signer.id}`}
                    className="flex items-center w-full p-5 cursor-pointer h-[70px] space-x-3 text-xl font-bold border border-black/[.04] bg-white dark:bg-signerDarkBg hover:bg-black/[.04] dark:border-white/[.04] dark:hover:bg-signerDarkHoverBg rounded-xl shadow-sm"
                    onClick={() => selectSigner(signer.id)}
                  >
                    <img
                      src={signer.icon}
                      alt={signer.label}
                      className="w-8 h-8 bg-gray-100 rounded-full"
                    />
                    <p className="text-sm text-black dark:text-white">{signer.label}</p>
                  </div>
                ))}
                {!isViewAll ? (
                  <Button type="secondary" onClick={() => setIsViewAll(true)}>
                    View all
                  </Button>
                ) : (
                  <SignerInput />
                )}
              </div>
              <div></div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </TooltipProvider>
  )
}
