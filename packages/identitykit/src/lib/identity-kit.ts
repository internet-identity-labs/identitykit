import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp"
import { Principal } from "@dfinity/principal"
import { SignerClient } from "./signer-client"
import { SignerAgent, SignerAgentOptions } from "./signer-agent"

export const IdentityKitAuthKind = {
  DELEGATION: "DELEGATION",
  ACCOUNTS: "ACCOUNTS",
} as const

type ObjectValuesType<T> = T[keyof T]

export type IdentityKitAuthKindType = ObjectValuesType<typeof IdentityKitAuthKind>

export class IdentityKit {
  public signerAgent!: SignerAgent

  constructor(
    public readonly signerClient: SignerClient,
    public readonly signerAgentOptions: Omit<SignerAgentOptions, "account">
  ) {}

  async getIcpBalance(): Promise<number> {
    const connectedUser = this.signerClient.connectedUser
    if (!connectedUser) throw new Error("Not authenticated")

    const balance = (
      await LedgerCanister.create().accountBalance({
        accountIdentifier: AccountIdentifier.fromPrincipal({
          principal: Principal.from(connectedUser.owner),
          subAccount: connectedUser.subAccount,
        }),
        certified: false,
      })
    ).toString()

    return Number(balance) / 10 ** 8
  }
}
