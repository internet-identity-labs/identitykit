import { Principal } from "@dfinity/principal"
import { SignerClient, SignerClientOptions, STORAGE_KEY } from "./client"
import { AccountsRequest, AccountsResponse, fromBase64 } from "@slide-computer/signer"
import { SubAccount } from "@dfinity/ledger-icp"
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
    // get and transform accounts from signer
    const params = this.options.derivationOrigin
      ? {
          derivationOrigin: this.options.derivationOrigin,
        }
      : {}

    const accountsResponse = await this.options.signer.sendRequest<
      AccountsRequest,
      AccountsResponse
    >({
      method: "icrc27_accounts",
      id: this.crypto.randomUUID(),
      jsonrpc: "2.0",
      ...params,
    })

    if ("error" in accountsResponse) {
      throw Error(accountsResponse.error.message)
    }

    const accounts = accountsResponse.result.accounts.map(({ owner, subaccount }) => {
      return {
        owner: Principal.fromText(owner),
        subaccount: subaccount === undefined ? undefined : fromBase64(subaccount),
      }
    })
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
      subaccount: ArrayBuffer | undefined
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
