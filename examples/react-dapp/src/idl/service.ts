import type { ActorMethod } from "@dfinity/agent"
import type { IDL } from "@dfinity/candid"

export interface Icrc21ConsentInfo {
  metadata: Icrc21ConsentMessageMetadata
  consent_message: Icrc21ConsentMessage
}
export type Icrc21ConsentMessage =
  | {
      LineDisplayMessage: { pages: Array<Icrc21LineDisplayPage> }
    }
  | { GenericDisplayMessage: string }
export interface Icrc21ConsentMessageMetadata {
  language: string
}
export interface Icrc21ConsentMessageRequest {
  arg: Uint8Array | number[]
  method: string
  user_preferences: Icrc21ConsentMessageSpec
}
export interface Icrc21ConsentMessageSpec {
  metadata: Icrc21ConsentMessageMetadata
  device_spec: [] | [Icrc21DeviceSpec]
}
export type Icrc21DeviceSpec =
  | { GenericDisplay: null }
  | {
      LineDisplay: {
        characters_per_line: number
        lines_per_page: number
      }
    }
export type Icrc21Error =
  | {
      GenericError: { description: string; error_code: bigint }
    }
  | { InsufficientPayment: Icrc21ErrorInfo }
  | { UnsupportedCanisterCall: Icrc21ErrorInfo }
  | { ConsentMessageUnavailable: Icrc21ErrorInfo }
export interface Icrc21ErrorInfo {
  description: string
}
export interface Icrc21LineDisplayPage {
  lines: Array<string>
}
export type Result = { Ok: Icrc21ConsentInfo } | { Err: Icrc21Error }
export interface _SERVICE {
  get_trusted_origins: ActorMethod<[], Array<string>>
  greet: ActorMethod<[string], string>
  greet_no_consent: ActorMethod<[string], string>
  icrc21_canister_call_consent_message: ActorMethod<[Icrc21ConsentMessageRequest], Result>
}
export declare const idlFactory: IDL.InterfaceFactory
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[]
