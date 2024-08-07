import clsx from "clsx"
import InfoIcon from "../assets/info.svg"
import { Tooltip } from "../ui/tooltip"

export interface ModalHeaderProps {
  onBack: () => void
  isViewAll: boolean
}

export const ModalHeader = ({ onBack, isViewAll }: ModalHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[10px]">
        {isViewAll && (
          <svg
            onClick={onBack}
            className="text-black cursor-pointer dark:text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.7272 11.864L4.99932 11.864"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.6562 18.5207L4.9994 11.8639L11.6562 5.20703"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
        <p className={clsx("font-bold")}>Connect your wallet</p>
      </div>
      <Tooltip
        align="end"
        side="bottom"
        tip={
          <div className="text-white leading-[16px]">
            <div className="text-sm font-bold">What is a Wallet?</div>
            <div className="text-xs font-bold mt-[12px]">A home for digital assets</div>
            <p className="text-xs">
              Wallets are used to send, receive, store, and display digital assets.
            </p>
            <div className="text-xs font-bold mt-[12px]">A new way to sign in</div>
            <p className="text-xs">
              Instead of creating new accounts and passwords on every website, just connect your
              wallet instead.
            </p>
          </div>
        }
        className="px-3 bg-black w-[320px] z-[1011] -mr-[15px]"
      >
        <img className="cursor-pointer" src={InfoIcon} />
      </Tooltip>
    </div>
  )
}
