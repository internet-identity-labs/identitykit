import { Locator } from "@playwright/test"

export interface Method {
  name: string
  locator: () => Locator
}

interface BaseRequestState {
  method: string
  params: {
    canisterId: string
    sender: string
    method: string
    arg: string
    expiration?: string
    pubkey?: string
    targets?: string[]
    signature?: string
  }
}

interface DelegationResponse {
  _inner?: unknown
  _delegation?: {
    delegations: {
      delegation: {
        expiration: unknown
        pubkey: unknown
        targets?: unknown
      }
      signature: unknown
    }[]
    publicKey: unknown
  }
}

interface AccountResponse {
  principal: {
    __principal__: string
  }
  subAccount: {
    bytes: object
  }
}

type RpcTextResponse = string[]

export type RequestState = BaseRequestState | DelegationResponse | AccountResponse | RpcTextResponse
