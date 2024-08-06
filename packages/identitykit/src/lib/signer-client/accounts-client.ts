import {
  IdbStorage,
  SignerStorage,
  removeDelegationChain,
  removeIdentity,
} from "@slide-computer/signer-storage"
import { SubAccount } from "@dfinity/ledger-icp"
import { IdleManager } from "./idle-manager"
import {
  STORAGE_CONNECTED_OWNER_KEY,
  STORAGE_KEY,
  SignerClient,
  SignerClientOptions,
} from "./client"

export interface AccountsSignerClientOptions extends SignerClientOptions {}

export class AccountsSignerClient extends SignerClient {
  constructor(options: AccountsSignerClientOptions, storage: SignerStorage) {
    super(options, storage)
  }

  public static async create(options: AccountsSignerClientOptions): Promise<SignerClient> {
    const storage = options.storage ?? new IdbStorage()
    return new AccountsSignerClient(options, storage)
  }

  public async login(): Promise<string> {
    const permissions = await this.options.signer.permissions()

    if (
      // TODO hot fix for nfid wallet, permissions have old format
      !permissions.find((x) =>
        x.scope
          ? "icrc27_accounts" === x.scope.method
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            "icrc27_accounts" === (x as any).method
      )
    ) {
      await this.options.signer.requestPermissions([
        {
          method: "icrc27_accounts",
        },
      ])
    }
    const account = (await this.options.signer.accounts())[0]

    if (!account.subaccount) {
      if (!this.options?.idleOptions?.disableIdle && !this.idleManager) {
        this.idleManager = IdleManager.create(this.options.idleOptions)
        this.registerDefaultIdleCallback()
      }
      await this.setConnectedUser(account.owner.toString())
      return account.owner.toString()
    }

    const subAccount = SubAccount.fromBytes(new Uint8Array(account.subaccount))

    if (typeof subAccount === typeof Error) {
      throw subAccount
    }

    await this.setConnectedUser(account.owner.toString(), subAccount as SubAccount)

    if (!this.options?.idleOptions?.disableIdle && !this.idleManager) {
      this.idleManager = IdleManager.create(this.options.idleOptions)
      this.registerDefaultIdleCallback()
    }
    return account.owner.toString()
  }

  public async logout(options: { returnTo?: string } = {}): Promise<void> {
    await removeIdentity(STORAGE_KEY, this.storage)
    await removeDelegationChain(STORAGE_KEY, this.storage)
    await this.storage.remove(STORAGE_CONNECTED_OWNER_KEY)
    this.idleManager?.exit()
    this.idleManager = undefined
    this.connectedUser = undefined
    if (options.returnTo) {
      try {
        window.history.pushState({}, "", options.returnTo)
      } catch (e) {
        window.location.href = options.returnTo
      }
    }
  }
}
