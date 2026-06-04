import { Principal } from "@icp-sdk/core/principal"
import { SignerClient, SignerClientOptions, STORAGE_KEY } from "./client"
import { SubAccount } from "@icp-sdk/canisters/ledger/icp"
import { IdleManager } from "../timeout-managers/idle-manager"

export interface AccountsSignerClientOptions extends SignerClientOptions {}

export class AccountsSignerClient extends SignerClient {
  public static async create(options: AccountsSignerClientOptions): Promise<AccountsSignerClient> {
    const signerClient = new AccountsSignerClient(options)
    if (SignerClient.shouldCheckIsUserConnected()) {
      const storageConnectedUser = await signerClient.getConnectedUserFromStorage()
      await signerClient.setConnectedUser(storageConnectedUser)
    }
    return signerClient
  }

  public async login(): Promise<void> {
    const accounts = await this.options.signer.getAccounts()
    await this.setAccounts(accounts)
    const account = accounts[0]

    if (!account.subaccount) {
      if (!this.options?.idleOptions?.disableIdle && !this.idleManager) {
        this.idleManager = new IdleManager(this.options.idleOptions)
        this.registerDefaultIdleCallback()
      }
      await this.setConnectedUserToStorage({ owner: account.owner.toString() })
      return
    }

    await this.setConnectedUserToStorage({
      owner: account.owner.toString(),
      subAccount: account.subaccount,
    })

    if (!this.options?.idleOptions?.disableIdle && !this.idleManager) {
      this.idleManager = new IdleManager(this.options.idleOptions)
      this.registerDefaultIdleCallback()
    }
  }

  public async logout(options?: { returnTo?: string }): Promise<void> {
    await this.storage.remove(`accounts-${STORAGE_KEY}`)
    return super.logout(options)
  }

  private async setAccounts(
    accounts: {
      owner: Principal
      subaccount?: Uint8Array
    }[]
  ) {
    return this.storage.set(
      `accounts-${STORAGE_KEY}`,
      JSON.stringify(
        accounts.map((acc) => ({
          owner: acc.owner.toString(),
          subaccount: acc.subaccount && new TextDecoder().decode(acc.subaccount),
        }))
      )
    )
  }

  async getAccounts(): Promise<
    | {
        principal: Principal
        subAccount?: SubAccount
      }[]
    | undefined
  > {
    const storageData = await this.storage.get(`accounts-${STORAGE_KEY}`)
    if (!storageData || typeof storageData !== "string") return
    return JSON.parse(storageData).map(
      ({ owner, subaccount }: { owner: string; subaccount?: string }) => {
        let subAccount: SubAccount | undefined

        if (subaccount) {
          const subAccountOrError = SubAccount.fromBytes(
            new Uint8Array(new TextEncoder().encode(subaccount))
          )

          if (typeof subAccountOrError === typeof Error) {
            throw subAccount
          }

          subAccount = subAccountOrError as SubAccount
        }
        return {
          principal: Principal.from(owner),
          subAccount,
        }
      }
    )
  }
}
