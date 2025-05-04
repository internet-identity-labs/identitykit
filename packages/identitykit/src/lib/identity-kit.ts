import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp"
import {
  AccountsSignerClient,
  AccountsSignerClientOptions,
  DelegationSignerClient,
  DelegationSignerClientOptions,
  SignerClient,
} from "./signer-client"
import { InternetIdentity, OISY, Stoic } from "./signers"

export const IdentityKitAuthType = {
  DELEGATION: "DELEGATION",
  ACCOUNTS: "ACCOUNTS",
} as const

// here listed only specific signers which does not support specific auth type
export const IdentityKitCustomSignerAuthType = {
  [OISY.id]: IdentityKitAuthType.ACCOUNTS,
  [InternetIdentity.id]: IdentityKitAuthType.DELEGATION,
  [Stoic.id]: IdentityKitAuthType.DELEGATION,
}

type ObjectValuesType<T> = T[keyof T]

export type IdentityKitAuthType = ObjectValuesType<typeof IdentityKitAuthType>

export class IdentityKit<
  T extends IdentityKitAuthType = typeof IdentityKitAuthType.ACCOUNTS,
  TSignerClient = T extends typeof IdentityKitAuthType.DELEGATION
    ? DelegationSignerClient
    : AccountsSignerClient,
> {
  public signerClient: TSignerClient

  constructor(signerClient: TSignerClient) {
    this.signerClient = signerClient
  }

  async getIcpBalance(): Promise<number> {
    const connectedUser = await (this.signerClient as SignerClient).connectedUser
    if (!connectedUser) throw new Error("Not authenticated")

    const balance = (
      await LedgerCanister.create().accountBalance({
        accountIdentifier: AccountIdentifier.fromPrincipal({
          principal: connectedUser.principal,
          subAccount: connectedUser.subAccount,
        }),
        certified: false,
      })
    ).toString()

    return Number(balance) / 10 ** 8
  }

  static async create<
    T extends IdentityKitAuthType = typeof IdentityKitAuthType.ACCOUNTS,
    TSignerClientOptions = T extends typeof IdentityKitAuthType.DELEGATION
      ? DelegationSignerClientOptions
      : AccountsSignerClientOptions,
  >({ signerClientOptions, authType }: { signerClientOptions: TSignerClientOptions; authType: T }) {
    if (authType === IdentityKitAuthType.DELEGATION) {
      const signerClient = await DelegationSignerClient.create(
        signerClientOptions as DelegationSignerClientOptions
      )
      return new this(signerClient)
    } else {
      const signerClient = await AccountsSignerClient.create(
        signerClientOptions as DelegationSignerClientOptions
      )
      return new this(signerClient)
    }
  }
}
