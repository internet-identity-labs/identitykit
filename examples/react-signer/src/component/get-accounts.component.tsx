import { Dispatch, SetStateAction, useState } from "react"
import { InteractivePanel } from "./interactive-panel.component"
import { Account } from "../service/account.service"
import { State } from "../hook/use-signer"

interface GetAccountsRequest {
  origin: string
  accounts: Account[]
  timeout: ReturnType<typeof setTimeout>
  onReject: () => Promise<void>
  onApprove: (accounts: Account[]) => Promise<void>
  setState: Dispatch<SetStateAction<State>>
}

export const GetAccounts = ({
  origin,
  accounts,
  timeout,
  onApprove,
  onReject,
  setState,
}: GetAccountsRequest) => {
  const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([])

  return (
    <>
      <div className="mb-2 text-xl font-bold text-center">Get Accounts</div>
      <small className="block text-center">
        <a className="text-blue-500" target="_blank" href={origin}>
          {origin}
        </a>{" "}
        wants to get your principal and subaccount
      </small>

      <div className="flex flex-col p-5 pb-8 mt-5 space-y-4 rounded-xl border border-solid border-neutral-200">
        <small className="font-bold">Share wallet address</small>
        {accounts.map((acc, index) => (
          <div key={`acc_${acc.displayName}`} className="flex items-center space-x-2.5">
            <input
              id={`acc_${index}`}
              checked={selectedAccounts.includes(acc)}
              aria-describedby="comments-description"
              type="checkbox"
              onChange={(e) => {
                setSelectedAccounts(
                  e.target.checked
                    ? selectedAccounts.concat([acc])
                    : selectedAccounts.filter((a) => a !== acc)
                )
              }}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600 cursor-pointer"
            />
            <label htmlFor={`acc_${index}`} className="text-xs uppercase cursor-pointer">
              {acc.displayName}
            </label>
          </div>
        ))}
      </div>
      <InteractivePanel
        onApprove={async () => {
          await onApprove(selectedAccounts)
        }}
        onReject={onReject}
        setState={setState}
        approveDisabled={!selectedAccounts.length}
        timeout={timeout}
      />
    </>
  )
}
