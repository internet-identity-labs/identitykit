import { AccountIdentifier, LedgerCanister, SubAccount } from "@dfinity/ledger-icp"
import { Principal } from "@dfinity/principal"
import {
  AccountsSignerClient,
  AccountsSignerClientOptions,
  DelegationSignerClient,
  DelegationSignerClientOptions,
  SignerClient,
} from "./signer-client"
import { SignerAgent, SignerAgentOptions } from "@slide-computer/signer-agent"
import { Signer } from "@slide-computer/signer"

export const IdentityKitAuthType = {
  DELEGATION: "DELEGATION",
  ACCOUNTS: "ACCOUNTS",
} as const

type ObjectValuesType<T> = T[keyof T]

export type IdentityKitAuthType = ObjectValuesType<typeof IdentityKitAuthType>

export class IdentityKit<
  T extends IdentityKitAuthType = typeof IdentityKitAuthType.ACCOUNTS,
  TSignerClient = T extends typeof IdentityKitAuthType.DELEGATION
    ? DelegationSignerClient
    : AccountsSignerClient,
> {
  public signerAgent?: SignerAgent<Signer>
  public signerClient: TSignerClient

  constructor(signerClient: TSignerClient) {
    this.signerClient = signerClient
  }

  public clone(): IdentityKit {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
  }

  async createSignerAgent(options: SignerAgentOptions<Signer>): Promise<SignerAgent<Signer>> {
    const signerAgent = await SignerAgent.create(options)
    this.signerAgent = signerAgent
    return signerAgent
  }

  async getIcpBalance(): Promise<number> {
    const connectedUser = await (this.signerClient as SignerClient).connectedUser
    if (!connectedUser) throw new Error("Not authenticated")

    let subAccount: SubAccount | undefined

    if (connectedUser.subAccount) {
      const subAccountOrError = SubAccount.fromBytes(new Uint8Array(connectedUser.subAccount))

      if (typeof subAccountOrError === typeof Error) {
        throw subAccount
      }

      subAccount = subAccountOrError as SubAccount
    }

    const balance = (
      await LedgerCanister.create().accountBalance({
        accountIdentifier: AccountIdentifier.fromPrincipal({
          principal: Principal.from(connectedUser.owner),
          subAccount,
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
