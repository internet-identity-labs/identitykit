import clsx from "clsx"
import { SignerConfig } from "../../../lib/types"
import { SignerInput } from "./signer-input"

export interface SelectWalletListProps {
  signers: SignerConfig[]
  onSelectSigner: (id: string) => Promise<void | SignerConfig>
  isViewAll: boolean
  onViewAll: () => void
  featuredSigner?: SignerConfig
}

export const SelectWalletList = ({
  signers,
  onSelectSigner,
  isViewAll,
  onViewAll,
  featuredSigner,
}: SelectWalletListProps) => {
  return (
    <div>
      <div className="ik-flex ik-flex-col ik-gap-2 ik-relative ik-overflow-auto ik-max-h-[420px]">
        {signers.map((signer) => (
          <div
            key={`signer_${signer.id}`}
            className={clsx(
              "ik-shadow-[0px_2px_10px_rgba(0,0,0,0.03)] ik-rounded-[13px]",
              featuredSigner?.id === signer.id
                ? "ik-gradient-border"
                : "ik-border ik-border-black/5 dark:ik-border-white/5"
            )}
          >
            <div
              id={`signer_${signer.id}`}
              className={clsx(
                "ik-bg-white dark:ik-bg-zinc-800 ik-rounded-[12px] ik-cursor-pointer",
                "hover:ik-bg-gray-50 dark:hover:ik-bg-signerDarkHoverBg",
                "ik-flex ik-items-center ik-space-x-3 ik-w-full ik-p-5",
                featuredSigner?.id === signer.id && signer?.description?.length && "!ik-items-start"
              )}
              onClick={async () => {
                await onSelectSigner(signer.id)
              }}
            >
              <img src={signer.icon} alt={signer.label} className="ik-w-8 ik-h-8" />

              <div className="ik-text-black dark:ik-text-white">
                <p className="ik-text-sm ik-font-bold ik-leading-[25px]">{signer.label}</p>
                {featuredSigner?.id === signer.id && signer.description && (
                  <p className="ik-text-xs ik-text-gray-400 dark:ik-text-zinc-400 ik-leading-[20px]">
                    {signer.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isViewAll ? (
        <div className="ik-flex ik-py-3.5 ik-mt-2">
          <small
            onClick={onViewAll}
            className="ik-text-primary dark:ik-text-teal-500 ik-font-bold ik-cursor-pointer ik-mx-auto ik-block"
          >
            View all
          </small>
        </div>
      ) : (
        <SignerInput />
      )}
    </div>
  )
}
