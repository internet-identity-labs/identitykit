import { Actor, HttpAgent } from "@icp-sdk/core/agent"
import { IDL } from "@icp-sdk/core/candid"
import { Principal } from "@icp-sdk/core/principal"

export const ICP_LEDGER = { canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai", symbol: "ICP", decimals: 8 }
export const NFIDW_LEDGER = {
  canisterId: "mih44-vaaaa-aaaaq-aaekq-cai",
  symbol: "NFIDW",
  decimals: 8,
}
export type Ledger = typeof ICP_LEDGER

const IC_HOST = "https://icp-api.io"

const Account = IDL.Record({ owner: IDL.Principal, subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)) })
const TransferArg = IDL.Record({
  to: Account,
  fee: IDL.Opt(IDL.Nat),
  memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
  from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  created_at_time: IDL.Opt(IDL.Nat64),
  amount: IDL.Nat,
})

const balanceIdl: IDL.InterfaceFactory = ({ IDL }) =>
  IDL.Service({
    icrc1_balance_of: IDL.Func(
      [IDL.Record({ owner: IDL.Principal, subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)) })],
      [IDL.Nat],
      ["query"]
    ),
  })

const format = (amount: bigint, ledger: Ledger) =>
  `${Number(amount) / 10 ** ledger.decimals} ${ledger.symbol}`

/**
 * Fails the test up front with the account to top up, instead of letting it fail later
 * on a signer screen ("Insufficient ... balance") or a ledger error.
 */
export async function assertLedgerBalance(
  ledger: Ledger,
  owner: string,
  minimum: bigint
): Promise<void> {
  const agent = await HttpAgent.create({ host: IC_HOST })
  const actor = Actor.createActor<{ icrc1_balance_of: (a: unknown) => Promise<bigint> }>(
    balanceIdl,
    { agent, canisterId: ledger.canisterId }
  )
  const balance = await actor.icrc1_balance_of({ owner: Principal.fromText(owner), subaccount: [] })
  if (balance < minimum)
    throw new Error(
      `Not enough ${ledger.symbol} on test wallet ${owner}: ${format(balance, ledger)}, ` +
        `the test needs at least ${format(minimum, ledger)}. Top up this account and re-run.`
    )
}

/** Base64 candid `icrc1_transfer` argument, the format of the playground's `arg` field. */
export function encodeIcrc1TransferArg(to: string, amount: bigint): string {
  const bytes = IDL.encode(
    [TransferArg],
    [
      {
        to: { owner: Principal.fromText(to), subaccount: [] },
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount,
      },
    ]
  )
  return Buffer.from(bytes).toString("base64")
}
