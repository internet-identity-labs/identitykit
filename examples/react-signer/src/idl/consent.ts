import type { ActorMethod } from "@dfinity/agent"
import type { IDL } from "@dfinity/candid"

export interface icrc21_consent_info {
  metadata: icrc21_consent_message_metadata
  consent_message: icrc21_consent_message
}
export type icrc21_consent_message =
  | {
      LineDisplayMessage: { pages: Array<{ lines: Array<string> }> }
    }
  | { GenericDisplayMessage: string }
export interface icrc21_consent_message_metadata {
  utc_offset_minutes: [] | [number]
  language: string
}
export interface icrc21_consent_message_request {
  arg: Uint8Array | number[]
  method: string
  user_preferences: icrc21_consent_message_spec
}
export type icrc21_consent_message_response = { Ok: icrc21_consent_info } | { Err: icrc21_error }
export interface icrc21_consent_message_spec {
  metadata: icrc21_consent_message_metadata
  device_spec:
    | []
    | [
        | { GenericDisplay: null }
        | {
            LineDisplay: {
              characters_per_line: number
              lines_per_page: number
            }
          },
      ]
}
export type icrc21_error =
  | {
      GenericError: { description: string; error_code: bigint }
    }
  | { InsufficientPayment: icrc21_error_info }
  | { UnsupportedCanisterCall: icrc21_error_info }
  | { ConsentMessageUnavailable: icrc21_error_info }
export interface icrc21_error_info {
  description: string
}
export interface _SERVICE {
  get_trusted_origins: ActorMethod<[], Array<string>>
  greet: ActorMethod<[string], string>
  greet_no_consent: ActorMethod<[string], string>
  icrc10_supported_standards: ActorMethod<[], Array<{ url: string; name: string }>>
  icrc21_canister_call_consent_message: ActorMethod<
    [icrc21_consent_message_request],
    icrc21_consent_message_response
  >
}
export declare const idlFactory: IDL.InterfaceFactory
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[]
