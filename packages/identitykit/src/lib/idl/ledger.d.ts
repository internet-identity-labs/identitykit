export interface AccountBalanceArgs {
  account: AccountIdentifier
}
export type AccountIdentifier = Array<number>

export interface _SERVICE {
  account_balance: (arg_0: AccountBalanceArgs) => Promise<Tokens>
  decimals: () => Promise<{ decimals: number }>
}
