import { IdleManager } from "./idle-manager"
import { Principal } from "@dfinity/principal"
import { SignerClient, SignerClientOptions } from "./client"
import { AccountsRequest, AccountsResponse, fromBase64 } from "@slide-computer/signer"

export interface AccountsSignerClientOptions extends SignerClientOptions {}

export class AccountsSignerClient extends SignerClient {
  public static async create(options: AccountsSignerClientOptions): Promise<AccountsSignerClient> {
    const signerClient = new AccountsSignerClient(options)
    const storageConnectedUser = await signerClient.getConnectedUserFromStorage()
    await signerClient.setConnectedUser(storageConnectedUser)
    return signerClient
  }

  public async login(): Promise<{
    signerResponse: {
      owner: Principal
      subaccount?: ArrayBuffer
    }[]
    connectedAccount: string
  }> {
    // get and transform accounts from signer
    const accountsResponse = await this.options.signer.sendRequest<
      AccountsRequest,
      AccountsResponse
    >({
      method: "icrc27_accounts",
      id: this.crypto.randomUUID(),
      jsonrpc: "2.0",
      params: this.options.derivationOrigin
        ? {
            derivationOrigin: this.options.derivationOrigin,
          }
        : undefined,
    })

    if ("error" in accountsResponse) {
      throw Error(accountsResponse.error.message)
    }

    const accounts = accountsResponse.result.accounts.map(({ owner, subaccount }) => ({
      owner: Principal.fromText(owner),
      subaccount: subaccount === undefined ? undefined : fromBase64(subaccount),
    }))
    const account = accounts[0]

    if (!account.subaccount) {
      if (!this.options?.idleOptions?.disableIdle && !this.idleManager) {
        this.idleManager = IdleManager.create(this.options.idleOptions)
        this.registerDefaultIdleCallback()
      }
      await this.setConnectedUserToStorage({ owner: account.owner.toString() })
      return {
        signerResponse: accounts,
        connectedAccount: account.owner.toString(),
      }
    }

    await this.setConnectedUserToStorage({
      owner: account.owner.toString(),
      subAccount: account.subaccount,
    })

    if (!this.options?.idleOptions?.disableIdle && !this.idleManager) {
      this.idleManager = IdleManager.create(this.options.idleOptions)
      this.registerDefaultIdleCallback()
    }
    return {
      signerResponse: accounts,
      connectedAccount: account.owner.toString(),
    }
  }
}
