import { IdentityKitAuthType } from "@nfid/identitykit"
import clsx from "clsx"
import { ResponseSection } from "../../molecules/response-section"
import { CodeSection } from "../../molecules/code-section"

const getUsageExample = (authType: IdentityKitAuthType) =>
  `import { IdentityKitProvider, IdentityKitTheme, ConnectWalletButton } from "@nfid/identitykit/react"
import { NFIDW, IdentityKitAuthType } from "@nfid/identitykit"

<IdentityKitProvider 
  signers={[NFIDW]}
  theme={IdentityKitTheme.LIGHT} // LIGHT, DARK, SYSTEM (by default)
  authType={IdentityKitAuthType.${authType}} // DELEGATION, ACCOUNTS (by default)
>
  <ConnectWalletButton />
</IdentityKitProvider>`

export function AuthTypeTabs({
  value,
  onChange,
  accountsResponseJson = "{}",
  delegationResponseJson = "{}",
}: {
  value: IdentityKitAuthType
  onChange: (type: IdentityKitAuthType) => void
  accountsResponseJson?: string
  delegationResponseJson?: string
}) {
  const isAccounts = value === IdentityKitAuthType.ACCOUNTS
  return (
    <>
      <div className="font-semibold text-black dark:text-white border-b-2 border-grey-500 dark:border-zinc-700 w-auto mb-1">
        <ul className="flex flex-wrap">
          <li
            onClick={() => {
              if (!isAccounts) onChange(IdentityKitAuthType.ACCOUNTS)
            }}
            className={clsx(
              "w-1/2 sm:w-[150px] cursor-pointer border-b-2 -mb-[2px]",
              isAccounts
                ? "text-primary border-primary"
                : "border-transparent hover:text-primary hover:border-primary"
            )}
          >
            <div className="inline-block py-2 rounded-t-lg">Account</div>
          </li>
          <li
            onClick={() => {
              if (isAccounts) onChange(IdentityKitAuthType.DELEGATION)
            }}
            className={clsx(
              "w-1/2 sm:w-[150px] cursor-pointer border-b-2 -mb-[2px]",
              !isAccounts
                ? "text-primary border-primary"
                : "border-transparent hover:text-primary hover:border-primary"
            )}
          >
            <div className="inline-block py-2 rounded-t-lg">Delegation</div>
          </li>
        </ul>
      </div>
      <div>
        {isAccounts ? (
          <>
            <small className="mb-5 mt-2 block">
              Accounts are standard wallet address strings users may have used across the ICP
              ecosystem, for example to store assets, participate in defi, or engage in a variety of
              other activity.
            </small>
            <ResponseSection value={accountsResponseJson} />
            <CodeSection className="mt-3" value={getUsageExample(IdentityKitAuthType.ACCOUNTS)} />
          </>
        ) : (
          <>
            <small className="mb-5 mt-2 block">
              Delegations are accounts that have been pre-approved to execute transactions on the
              user's behalf, resulting in the removal of wallet approval prompts.
            </small>
            <ResponseSection value={delegationResponseJson} />
            <CodeSection className="mt-3" value={getUsageExample(IdentityKitAuthType.DELEGATION)} />
          </>
        )}
      </div>
    </>
  )
}
