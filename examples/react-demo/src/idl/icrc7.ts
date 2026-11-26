// @ts-nocheck
// Minimal ICRC-7 / ICRC-37 IDL for the demo.
export const idlFactory = ({ IDL }) => {
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  })
  const ApprovalInfo = IDL.Record({
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Nat64,
    expires_at: IDL.Opt(IDL.Nat64),
    spender: Account,
  })
  const ApproveTokenArg = IDL.Record({
    token_id: IDL.Nat,
    approval_info: ApprovalInfo,
  })
  const ApproveTokenError = IDL.Variant({
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    Expired: IDL.Record({ ledger_time: IDL.Nat64 }),
    GenericBatchError: IDL.Record({ error_code: IDL.Nat, message: IDL.Text }),
    GenericError: IDL.Record({ error_code: IDL.Nat, message: IDL.Text }),
    NonExistingTokenId: IDL.Null,
    TooOld: IDL.Null,
    Unauthorized: IDL.Null,
  })
  const ApproveTokenResult = IDL.Variant({ Ok: IDL.Nat, Err: ApproveTokenError })
  const TransferArg = IDL.Record({
    to: Account,
    token_id: IDL.Nat,
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
  })
  const TransferError = IDL.Variant({
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    GenericBatchError: IDL.Record({ error_code: IDL.Nat, message: IDL.Text }),
    GenericError: IDL.Record({ error_code: IDL.Nat, message: IDL.Text }),
    InvalidRecipient: IDL.Null,
    NonExistingTokenId: IDL.Null,
    TooOld: IDL.Null,
    Unauthorized: IDL.Null,
  })
  const TransferResult = IDL.Variant({ Ok: IDL.Nat, Err: TransferError })
  return IDL.Service({
    icrc37_approve_tokens: IDL.Func(
      [IDL.Vec(ApproveTokenArg)],
      [IDL.Vec(IDL.Opt(ApproveTokenResult))],
      []
    ),
    icrc7_transfer: IDL.Func([IDL.Vec(TransferArg)], [IDL.Vec(IDL.Opt(TransferResult))], []),
  })
}
