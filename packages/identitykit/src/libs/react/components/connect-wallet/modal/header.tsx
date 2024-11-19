import clsx from "clsx"
import { Tooltip } from "../../ui/tooltip"

export interface ModalHeaderProps {
  onBack: () => void
  isViewAll: boolean
}

export const Header = ({ onBack, isViewAll }: ModalHeaderProps) => {
  return (
    <div className="ik-flex ik-items-center ik-justify-between">
      <div className="ik-flex ik-items-center ik-gap-[10px]">
        {isViewAll && (
          <svg
            data-testid="svg"
            onClick={onBack}
            className="ik-text-black ik-cursor-pointer dark:ik-text-white"
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
        <p className={clsx("ik-font-bold ik-text-black dark:ik-text-white")}>Connect your wallet</p>
      </div>
      <Tooltip
        align="end"
        side="bottom"
        tip={
          <div className="ik-text-white ik-leading-[16px]">
            <div className="ik-text-sm ik-font-bold">What is a Wallet?</div>
            <div className="ik-text-xs ik-font-bold ik-mt-[12px]">A home for digital assets</div>
            <p className="ik-text-xs">
              Wallets are used to send, receive, store, and display digital assets.
            </p>
            <div className="ik-text-xs ik-font-bold ik-mt-[12px]">A new way to sign in</div>
            <p className="ik-text-xs">
              Instead of creating new accounts and passwords on every website, just connect your
              wallet instead.
            </p>
          </div>
        }
        className="ik-px-3 ik-bg-black ik-w-[320px] ik-z-[1011] -mr-[15px]"
      >
        <svg
          className="ik-cursor-pointer"
          data-testid="info"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 16.125V11.3125"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 7.875H12.0092"
            stroke="#9CA3AF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Tooltip>
    </div>
  )
}
