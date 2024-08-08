type WebAuthnCredential = {
  credentialId: string
  isResidentCredential: boolean
  privateKey: string
  signCount: number
}

type AuthState = {
  delegation: string
  identity: string
}

export type TestUser = {
  seed: string
  icpAddress: string
  btcAddress: string
  ethAddress: string
  account: { anchor: number }
  credentials: WebAuthnCredential
  authstate: AuthState
}
