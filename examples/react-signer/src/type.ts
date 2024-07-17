export interface RPCBase {
  origin: string
  jsonrpc: string
  id: string
}

export interface RPCMessage extends RPCBase {
  method: string
  params: unknown[]
}

export interface RPCSuccessResponse extends RPCBase {
  result: unknown
}

export interface RPCErrorResponse extends RPCBase {
  error: {
    code: number
    message: string
    data?: unknown
  }
}

export interface Icrc25DtoRequest {
  scopes: ScopeRequest[]
}

export interface ScopeRequest {
  method: string
}

export interface Icrc25DtoResponse {
  scopes: ScopeResponse[]
}

export interface ScopeResponse {
  scope: {
    method: string
  }
  state: string
}
