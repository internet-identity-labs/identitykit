import clsx from "clsx"
import { SignerConfig } from "../../../lib/types"
import { Button } from "../ui/button"
import { SignerInput } from "./signer-input"

export interface SelectWalletListProps {
  signers: SignerConfig[]
  onSelectSigner: (id: string) => void
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
      <div className="flex flex-col gap-2.5 relative overflow-auto max-h-[420px]">
        {signers.map((signer) => (
          <div
            className={clsx(
              "shadow-[0px_2px_10px_rgba(0,0,0,0.03)] rounded-[13px]",
              featuredSigner?.id === signer.id
                ? "gradient-border"
                : "border border-black/5 dark:border-white/5"
            )}
          >
            <div
              id={`signer_${signer.id}`}
              key={`signer_${signer.id}`}
              className={clsx(
                "bg-white dark:bg-zinc-800 rounded-[12px] cursor-pointer",
                "hover:bg-gray-50 dark:hover:bg-signerDarkHoverBg",
                "flex items-center space-x-3 w-full p-5",
                signer?.description?.length && "!items-start"
              )}
              onClick={() => onSelectSigner(signer.id)}
            >
              <img src={signer.icon} alt={signer.label} className="w-8 h-8" />

              <div className="text-black dark:text-white">
                <p className="text-sm font-bold leading-[25px]">{signer.label}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-400 leading-[20px]">
                  {signer.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isViewAll ? (
        <Button className="mt-2.5" block type="secondary" onClick={onViewAll}>
          View all
        </Button>
      ) : (
        <SignerInput />
      )}
    </div>
  )
}
