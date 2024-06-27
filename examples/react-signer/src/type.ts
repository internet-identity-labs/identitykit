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

export interface Icrc25Dto {
  scopes: Scope[]
}

export interface Scope {
  method: string
}
