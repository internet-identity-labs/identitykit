import { Dispatch, SetStateAction, useState } from "react"
import { InteractivePanel } from "./interactive-panel.component"
import { Account, AccountType } from "../service/account.service"
import { State } from "../hook/use-signer"
import clsx from "clsx"

interface GetDelegationRequest {
  origin: string
  accounts: Account[]
  isPublicAccountsAllowed: boolean
  timeout: ReturnType<typeof setTimeout>
  onReject: () => Promise<void>
  onApprove: (accounts: Account[]) => Promise<void>
  setState: Dispatch<SetStateAction<State>>
}

const Radio = ({
  inputId,
  displayName,
  checked,
  disabled,
  onChange,
  ...props
}: {
  inputId: string
  displayName: string
  checked?: boolean
  disabled?: boolean
  onChange: () => unknown
}) => {
  return (
    <div className="flex items-center space-x-2.5" {...props}>
      <input
        id={inputId}
        type="radio"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 border-gray-300 cursor-pointer text-primary-600 focus:ring-primary-600"
        disabled={disabled ?? false}
      />
      <label
        htmlFor={inputId}
        className={clsx("text-xs uppercase cursor-pointer", disabled && "text-gray-500")}
      >
        {displayName}
      </label>
    </div>
  )
}

export const GetDelegation = ({
  origin,
  accounts,
  isPublicAccountsAllowed,
  timeout,
  onApprove,
  onReject,
  setState,
}: GetDelegationRequest) => {
  const globalAccount = accounts.find((acc) => acc.type === AccountType.GLOBAL)
  const sessionAccounts = accounts.filter((acc) => acc.type === AccountType.SESSION)

  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(undefined)

  return (
    <>
      <div className="mb-2 text-xl font-bold text-center">Get Delegation</div>
      <small className="block text-center">
        Choose a delegation for{" "}
        <a className="text-blue-500" target="_blank" href={origin}>
          {origin}
        </a>
      </small>
      <div className="flex flex-col mt-5 border border-solid rounded-xl border-neutral-200">
        <div className="px-5 py-5 space-y-4 border-b border-solid border-neutral-200">
          <small className="font-bold">Global account</small>
          {globalAccount && (
            <Radio
              inputId={`acc_${globalAccount.id}`}
              displayName={globalAccount.displayName}
              checked={selectedAccount === globalAccount}
              onChange={() => setSelectedAccount(globalAccount)}
              disabled={!isPublicAccountsAllowed}
            />
          )}
        </div>
        <div className="px-5 py-5 space-y-4">
          <small className="font-bold">Session accounts</small>
          {sessionAccounts.map((acc) => (
            <Radio
              key={`acc_${acc.displayName}`}
              inputId={`acc_${acc.id}`}
              displayName={acc.displayName}
              checked={selectedAccount === acc}
              onChange={() => setSelectedAccount(acc)}
            />
          ))}
        </div>
      </div>
      <InteractivePanel
        onApprove={async () => {
          if (selectedAccount) await onApprove([selectedAccount])
        }}
        onReject={onReject}
        setState={setState}
        approveDisabled={!selectedAccount}
        timeout={timeout}
      />
    </>
  )
}
