type ObjectValuesType<T> = T[keyof T]

export const CallCanisterMethod = {
  icrc2_approve: "icrc2_approve",
  icrc2_transfer_from: "icrc2_transfer_from",
  transfer: "transfer",
  greet: "greet",
  greet_no_consent: "greet_no_consent",
} as const

export const CallCanisterMethodTitle = {
  [CallCanisterMethod.icrc2_approve]: "ICRC-2 approve",
  [CallCanisterMethod.icrc2_transfer_from]: "ICRC-2 transfer",
  [CallCanisterMethod.transfer]: "ICP transfer",
  [CallCanisterMethod.greet]: "With consent message",
  [CallCanisterMethod.greet_no_consent]: "Basic",
}

export const CALL_CANISTER_METHODS = Object.values(CallCanisterMethod)

export type CallCanisterMethodType = ObjectValuesType<typeof CallCanisterMethod>
