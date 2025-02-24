export interface RPCBase {
  origin: string
  jsonrpc: string
  id: string
}

export interface RPCMessage extends RPCBase {
  method: string
  params?: object | object[]
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
  scopes: Scope[]
}

export interface Scope {
  scope: {
    method: string
  }
  state: string
}
