import type { Signer } from "@slide-computer/signer"
import { IdbStorage, type SignerStorage } from "@slide-computer/signer-storage"
import { AuthClientStorage } from "@dfinity/auth-client"
import { SubAccount } from "@dfinity/ledger-icp"
import { Principal } from "@dfinity/principal"
import { IdleManager, IdleManagerOptions } from "../timeout-managers/idle-manager"

export const STORAGE_KEY = "client"
export const STORAGE_CONNECTED_OWNER_KEY = "connected-owner"
export const STORAGE_CONNECTED_SUBACCOUNT_KEY = "connected-subaccount"

export interface IdleOptions extends IdleManagerOptions {
  /**
   * Disables idle functionality for {@link IdleManager}
   * @default false
   */
  disableIdle?: boolean

  /**
   * Disables default idle behavior - call logout
   * @default false
   */
  disableDefaultIdleCallback?: boolean
}

export interface SignerClientOptions {
  signer: Signer
  /**
   * Optional, used to generate random bytes
   * @default uses browser/node Crypto by default
   */
  crypto?: Pick<Crypto, "getRandomValues" | "randomUUID">
  /**
   * Optional storage with get, set, and remove. Uses {@link IdbStorage} by default
   */
  storage?: AuthClientStorage
  /**
   * Options to handle idle timeouts
   * @default after 30 minutes, invalidates the identity
   */
  idleOptions?: IdleOptions
  derivationOrigin?: string
  onLogout?: () => Promise<unknown>
}

export abstract class SignerClient {
  protected idleManager: IdleManager | undefined
  protected storage: SignerStorage = new IdbStorage()
  public connectedUser: { principal: Principal; subAccount?: SubAccount } | undefined

  constructor(protected options: SignerClientOptions) {
    if (!options?.idleOptions?.disableIdle) {
      this.idleManager = new IdleManager(options.idleOptions)
      this.registerDefaultIdleCallback()
    }
    if (options.storage) this.storage = options.storage as SignerStorage
  }

  protected registerDefaultIdleCallback() {
    /**
     * Default behavior is to clear stored identity and reload the page.
     * By either setting the disableDefaultIdleCallback flag or passing in a custom idle callback, we will ignore this config
     */
    if (!this.options?.idleOptions?.disableDefaultIdleCallback) {
      this.idleManager?.registerCallback(async () => {
        await this.logout()
      })
    }
  }

  protected async logout(options?: { returnTo?: string }): Promise<void> {
    await this.setConnectedUserToStorage(undefined)
    this.idleManager?.exit()
    this.idleManager = undefined
    await this.options.onLogout?.()
    if (options?.returnTo) {
      try {
        window.history.pushState({}, "", options.returnTo)
      } catch (e) {
        window.location.href = options.returnTo
      }
    }
  }

  protected async setConnectedUser(
    user:
      | {
          owner: string
          subAccount?: ArrayBuffer
        }
      | undefined
  ): Promise<void> {
    if (!user) this.connectedUser = undefined
    else {
      let subAccount: SubAccount | undefined

      if (user.subAccount) {
        const subAccountOrError = SubAccount.fromBytes(new Uint8Array(user.subAccount))

        if (typeof subAccountOrError === typeof Error) {
          throw subAccount
        }

        subAccount = subAccountOrError as SubAccount
      }

      this.connectedUser = {
        principal: Principal.from(user.owner),
        subAccount,
      }
    }
  }

  protected async setConnectedUserToStorage(
    user:
      | {
          owner: string
          subAccount?: ArrayBuffer
        }
      | undefined
  ): Promise<void> {
    if (!user) {
      await this.storage.remove(STORAGE_CONNECTED_OWNER_KEY)
      await this.storage.remove(STORAGE_CONNECTED_SUBACCOUNT_KEY)
      localStorage.removeItem("connected")
      this.setConnectedUser(undefined)
      return
    }
    await this.storage.set(STORAGE_CONNECTED_OWNER_KEY, user.owner)
    localStorage.setItem("connected", "1")
    if (user.subAccount)
      await this.storage.set(
        STORAGE_CONNECTED_SUBACCOUNT_KEY,
        new TextDecoder().decode(user.subAccount)
      )
    this.setConnectedUser({
      owner: user.owner,
      subAccount: user.subAccount,
    })
  }

  // sync method to check if it's needed to check authorization reading from async storage
  static shouldCheckIsUserConnected() {
    return !!localStorage.getItem("connected")
  }

  protected async getConnectedUserFromStorage(): Promise<
    | {
        owner: string
        subAccount?: ArrayBuffer
      }
    | undefined
  > {
    const owner = await this.storage.get(STORAGE_CONNECTED_OWNER_KEY)
    if (!owner) return
    const subAccount = await this.storage.get(STORAGE_CONNECTED_SUBACCOUNT_KEY)

    return {
      owner: owner.toString(),
      subAccount: subAccount
        ? (new TextEncoder().encode(subAccount.toString()).buffer as ArrayBuffer)
        : undefined,
    }
  }

  protected get crypto(): Pick<Crypto, "getRandomValues" | "randomUUID"> {
    return this.options.crypto ?? globalThis.crypto
  }
}
