import { useContext, useEffect } from "react"
import { IdentityKitContext } from "./context"
import * as Dialog from "@radix-ui/react-dialog"
import clsx from "clsx"
import { IdentityKitTheme } from "./constants"

export const IdentityKitModal = (props: { theme: IdentityKitTheme }) => {
  const { isModalOpen, selectedSigner, signers, selectSigner } = useContext(IdentityKitContext)

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

  // theme inherits from system by default
  const theme =
    props.theme === IdentityKitTheme.SYSTEM
      ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? IdentityKitTheme.DARK
        : IdentityKitTheme.LIGHT
      : props.theme

  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <div
          className={`${isModalOpen ? "block" : "hidden"} bg-black bg-opacity-25 backdrop-blur-[2px] fixed inset-0 z-[1009]`}
        />
        <Dialog.Content
          id="identity-kit-modal"
          data-identity-kit-theme={theme}
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
          <div className="h-full">
            <div className="p-[25px] pt-[30px] bg-white dark:bg-black gap-2.5 flex flex-col rounded-xl">
              <div className="px-2 mb-2.5 text-xl font-bold text-black dark:text-white">
                Connect your wallet
              </div>
              {signers.map((signer) => (
                <div
                  id={`signer_${signer.id}`}
                  key={`signer_${signer.id}`}
                  className="flex items-center w-full p-5 space-x-3 text-xl font-bold border border-black/[.04] dark:bg-signerDarkBg hover:bg-black/[.04] dark:border-white/[.04] dark:hover:bg-signerDarkHoverBg rounded-xl shadow-sm"
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
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
