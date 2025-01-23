type ObjectValuesType<T> = T[keyof T]

export const CallCanisterMethod = {
  icrc2_approve: "icrc2_approve",
  icrc2_transfer_from: "icrc2_transfer_from",
  icrc1_transfer: "icrc1_transfer",
  transfer: "transfer",
  greet_no_consent: "greet_no_consent",
  greet_update_call: "greet_update_call",
} as const

export const CallCanisterMethodTitle = {
  [CallCanisterMethod.icrc2_approve]: "ICRC-2 approve",
  [CallCanisterMethod.icrc2_transfer_from]: "ICRC-2 transfer",
  [CallCanisterMethod.icrc1_transfer]: "ICRC-1 transfer",
  [CallCanisterMethod.transfer]: "ICP transfer",
  [CallCanisterMethod.greet_no_consent]: "Canister query call to IdentityKit Demo canister",
  [CallCanisterMethod.greet_update_call]:
    "Canister long running update call to IdentityKit Demo canister",
}

export const CALL_CANISTER_METHODS = Object.values(CallCanisterMethod)

export type CallCanisterMethodType = ObjectValuesType<typeof CallCanisterMethod>
