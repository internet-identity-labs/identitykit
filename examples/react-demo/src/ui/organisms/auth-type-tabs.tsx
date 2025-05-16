import { IdentityKitAuthType } from "@nfid/identitykit"
import clsx from "clsx"
import { CodeSection, ResponseSection } from "../molecules"
import { useAccounts, useIdentity } from "@nfid/identitykit/react"

const getUsageExample = (authType: IdentityKitAuthType) =>
  `import { IdentityKitProvider, IdentityKitTheme, ConnectWalletButton } from "@nfid/identitykit/react"
import { NFIDW, IdentityKitAuthType } from "@nfid/identitykit"

<IdentityKitProvider 
  signers={[NFIDW]}
  theme={IdentityKitTheme.LIGHT} // LIGHT, DARK, SYSTEM (by default)
  authType={IdentityKitAuthType.${authType}} // ACCOUNTS, DELEGATION (by default)
>
  <ConnectWalletButton />
</IdentityKitProvider>`

export function AuthTypeTabs({
  onChange,
  authType,
}: {
  onChange: (type: IdentityKitAuthType) => void
  authType: IdentityKitAuthType
}) {
  const accounts = useAccounts()
  const identity = useIdentity()

  const isAccounts = authType === IdentityKitAuthType.ACCOUNTS || !!accounts

  return (
    <>
      <div className="font-semibold text-black dark:text-white border-b border-grey-500 dark:border-zinc-700 w-auto mb-1">
        <ul className="flex flex-wrap">
          <li
            onClick={() => {
              if (isAccounts) onChange(IdentityKitAuthType.DELEGATION)
            }}
            className={clsx(
              "w-1/2 sm:w-auto cursor-pointer border-b-2 -mb-[1px] sm:mr-[25px]",
              !isAccounts
                ? "border-primary"
                : "border-transparent text-zinc-500 hover:text-dark dark:hover:text-white hover:border-primary"
            )}
          >
            <div className="inline-block py-2 rounded-t-lg" id={"delegationMethodTab"}>
              Delegation
            </div>
          </li>
          <li
            onClick={() => {
              if (!isAccounts) onChange(IdentityKitAuthType.ACCOUNTS)
            }}
            className={clsx(
              "w-1/2 sm:w-auto cursor-pointer border-b-2 -mb-[1px]",
              isAccounts
                ? "border-primary"
                : "border-transparent text-zinc-500 hover:text-dark dark:hover:text-white hover:border-primary"
            )}
          >
            <div id={"accountMethodTab"} className="inline-block py-2 rounded-t-lg">
              Account
            </div>
          </li>
        </ul>
      </div>
      <div>
        {isAccounts ? (
          <>
            <p className="text-sm my-[20px] block">
              Accounts are standard wallet address strings users may have used across the ICP
              ecosystem, for example to store assets, participate in defi, or engage in a variety of
              other activity.
            </p>
            <ResponseSection value={JSON.stringify(accounts, null, 2)} id={"profile"} />
            <CodeSection
              className="mt-[25px]"
              value={getUsageExample(IdentityKitAuthType.ACCOUNTS)}
            />
          </>
        ) : (
          <>
            <small className="text-sm my-[20px] block">
              Delegations are accounts that have been pre-approved to execute transactions on the
              user's behalf, resulting in the removal of wallet approval prompts.
            </small>
            <ResponseSection value={JSON.stringify(identity, null, 2)} id={"profile"} />
            <CodeSection
              className="mt-[25px]"
              value={getUsageExample(IdentityKitAuthType.DELEGATION)}
            />
          </>
        )}
      </div>
    </>
  )
}
