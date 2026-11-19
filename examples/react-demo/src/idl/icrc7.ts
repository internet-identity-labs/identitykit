// @ts-nocheck
// Minimal ICRC-7 / ICRC-37 IDL for the demo — only icrc37_approve_tokens is needed here.
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
  return IDL.Service({
    icrc37_approve_tokens: IDL.Func([IDL.Vec(ApproveTokenArg)], [IDL.Reserved], []),
  })
}
