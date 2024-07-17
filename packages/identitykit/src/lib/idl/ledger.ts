export const idlFactory = ({ IDL }: any) => {
  const AccountIdentifier = IDL.Vec(IDL.Nat8)
  const AccountBalanceArgs = IDL.Record({ account: AccountIdentifier })
  const Tokens = IDL.Record({ e8s: IDL.Nat64 })

  return IDL.Service({
    account_balance: IDL.Func([AccountBalanceArgs], [Tokens], ["query"]),
    decimals: IDL.Func([], [IDL.Record({ decimals: IDL.Nat32 })], ["query"]),
  })
}

export const init = () => {
  return []
}
