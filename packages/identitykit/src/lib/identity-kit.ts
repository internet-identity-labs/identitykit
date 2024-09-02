import { AccountIdentifier, LedgerCanister, SubAccount } from "@dfinity/ledger-icp"
import { Principal } from "@dfinity/principal"
import { SignerClient } from "./signer-client"
import { SignerAgent, type SignerAgentOptions } from "@slide-computer/signer-agent"

export const IdentityKitAuthType = {
  DELEGATION: "DELEGATION",
  ACCOUNTS: "ACCOUNTS",
} as const

type ObjectValuesType<T> = T[keyof T]

export type IdentityKitAuthType = ObjectValuesType<typeof IdentityKitAuthType>

export class IdentityKit {
  public static signerAgent: SignerAgent
  public static signerClient?: SignerClient

  static create(signerClient: SignerClient) {
    IdentityKit.signerClient = signerClient
  }

  static async setSignerAgent(options: SignerAgentOptions) {
    IdentityKit.signerAgent = await SignerAgent.create(options)
  }

  static async getIcpBalance(): Promise<number> {
    const connectedUser = await IdentityKit.signerClient?.connectedUser
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
}
