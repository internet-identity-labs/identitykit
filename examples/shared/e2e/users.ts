import fs from "fs"

type SignedDelegation = {
  delegation: { expiration: string; pubkey: string; targets?: string[] }
  signature: string
}

export type AuthState = {
  delegation: { delegations: SignedDelegation[]; publicKey: string }
  identity: [string, string]
}

type AnonymousProfile = {
  /** Principal of the "application-specific address" for this dapp origin. */
  principal?: string
  /** Root public key of the anonymous ICRC-34 delegation chain for this origin. */
  delegationPublicKey?: string
}

export type TestUser = {
  seed: string
  icpAdress?: string
  account: { anchor: number; principalId: string }
  credentials: {
    credentialId: string
    isResidentCredential: boolean
    privateKey: string
    signCount: number
  }
  authstate: AuthState
  /** Values the suites assert on; keep them next to the account so rotating it is one edit. */
  wallet?: {
    publicPrincipal: string
    /** Keyed by dapp host, e.g. "localhost:3002". */
    anonymous?: Record<string, AnonymousProfile>
  }
}

const users: TestUser[] = JSON.parse(
  fs.readFileSync(new URL("./users.json", import.meta.url), "utf8")
)

export function getTestUser(anchor: number): TestUser {
  const user = users.find((u) => u.account.anchor === anchor)
  if (!user) throw new Error(`Test user ${anchor} is not in examples/shared/e2e/users.json`)
  return user
}

const NANOS_PER_MS = BigInt(1_000_000)

/** Earliest expiration of the stored auth state's delegation chain. */
export function authStateExpiresAt(user: TestUser): Date {
  const expirations = user.authstate.delegation.delegations.map((d) =>
    BigInt(`0x${d.delegation.expiration}`)
  )
  const earliest = expirations.reduce((a, b) => (b < a ? b : a))
  return new Date(Number(earliest / NANOS_PER_MS))
}

/**
 * Account data an NFIDW test needs, resolved once with readable errors instead of
 * `undefined` showing up deep inside an assertion.
 */
export class NfidwTestUser {
  readonly user: TestUser

  constructor(readonly anchor: number) {
    this.user = getTestUser(anchor)
  }

  get publicPrincipal(): string {
    const principal = this.user.wallet?.publicPrincipal
    if (!principal) throw new Error(`users.json: ${this.anchor} has no wallet.publicPrincipal`)
    return principal
  }

  anonymousPrincipal(dappHost: string): string {
    const principal = this.user.wallet?.anonymous?.[dappHost]?.principal
    if (!principal)
      throw new Error(`users.json: ${this.anchor} has no wallet.anonymous["${dappHost}"].principal`)
    return principal
  }

  anonymousDelegationPublicKey(dappHost: string): string {
    const key = this.user.wallet?.anonymous?.[dappHost]?.delegationPublicKey
    if (!key)
      throw new Error(
        `users.json: ${this.anchor} has no wallet.anonymous["${dappHost}"].delegationPublicKey`
      )
    return key
  }
}
