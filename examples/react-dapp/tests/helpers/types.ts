import { Locator } from "@playwright/test"

export interface Method {
  name: string
  locator: () => Locator
}

interface CanisterRequest {
  method: string
  params: Record<string, unknown>
}

interface Standard {
  name: string
  url: string
}

interface Response {
  contentMap: unknown
  certificate: unknown
}

interface Permission {
  scope: { method: string }
  state: "granted" | "denied"
}

interface Account {
  owner: string
  subaccount: string
}

interface Delegation {
  expiration: unknown
  pubkey: string
  targets?: string[]
  signature: unknown
  publicKey: string
}

type TextArray = string[]

export type RequestState =
  | CanisterRequest
  | Standard
  | Response
  | Permission
  | Account
  | Delegation
  | TextArray
