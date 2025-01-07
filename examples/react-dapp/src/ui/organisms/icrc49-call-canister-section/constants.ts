type ObjectValuesType<T> = T[keyof T]

export const CallCanisterMethod = {
  greet_no_consent: "greet_no_consent",
  greet: "greet",
  transfer: "transfer",
  icrc2_approve: "icrc2_approve",
  icrc2_transfer_from: "icrc2_transfer_from",
  icrc1_transfer: "icrc1_transfer",
} as const

export const CallCanisterMethodTitle = {
  [CallCanisterMethod.icrc2_approve]: "ICRC-2 approve",
  [CallCanisterMethod.icrc2_transfer_from]: "ICRC-2 transfer",
  [CallCanisterMethod.icrc1_transfer]: "ICRC-1 transfer",
  [CallCanisterMethod.transfer]: "ICP transfer",
  [CallCanisterMethod.greet]: "With consent message",
  [CallCanisterMethod.greet_no_consent]: "Basic",
}

export const CALL_CANISTER_METHODS = Object.values(CallCanisterMethod)

export type CallCanisterMethodType = ObjectValuesType<typeof CallCanisterMethod>
