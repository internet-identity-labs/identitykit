import { type SignIdentity } from "@dfinity/agent"
import { PartialIdentity } from "@dfinity/identity"
import type { Signer } from "@slide-computer/signer"
import { type SignerStorage } from "@slide-computer/signer-storage"
import { SubAccount } from "@dfinity/ledger-icp"
import { IdleManager, type IdleManagerOptions } from "./idle-manager"

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
   * Disables default idle behavior - call logout & reload window
   * @default false
   */
  disableDefaultIdleCallback?: boolean
}

export interface SignerClientOptions {
  signer: Signer
  /**
   * An identity to use as the base
   */
  identity?: SignIdentity | PartialIdentity
  /**
   * Optional, used to generate random bytes
   * @default uses browser/node Crypto by default
   */
  crypto?: Pick<Crypto, "getRandomValues">
  /**
   * Optional storage with get, set, and remove. Uses {@link IdbStorage} by default
   */
  storage?: SignerStorage
  /**
   * Options to handle idle timeouts
   * @default after 30 minutes, invalidates the identity
   */
  idleOptions?: IdleOptions
}

export abstract class SignerClient {
  protected idleManager: IdleManager | undefined = undefined
  public connectedUser: { owner: string; subAccount?: SubAccount } | undefined = undefined

  constructor(
    protected options: SignerClientOptions,
    protected storage: SignerStorage
  ) {
    if (!options?.idleOptions?.disableIdle) {
      this.idleManager = IdleManager.create(options.idleOptions)
      this.registerDefaultIdleCallback()
    }
  }

  protected registerDefaultIdleCallback() {
    /**
     * Default behavior is to clear stored identity and reload the page.
     * By either setting the disableDefaultIdleCallback flag or passing in a custom idle callback, we will ignore this config
     */
    if (
      !this.options?.idleOptions?.onIdle &&
      !this.options?.idleOptions?.disableDefaultIdleCallback
    ) {
      this.idleManager?.registerCallback(async () => {
        await this.logout()
        location.reload()
      })
    }
  }

  abstract login(options?: {
    /**
     * Expiration of the authentication in nanoseconds
     * @default  BigInt(8) hours * BigInt(3_600_000_000_000) nanoseconds
     */
    maxTimeToLive?: bigint
  }): Promise<string>

  abstract logout(options?: { returnTo?: string }): Promise<void>

  protected async setConnectedUser(owner: string, subAccount?: SubAccount): Promise<void> {
    await this.storage.set(STORAGE_CONNECTED_OWNER_KEY, owner)
    this.connectedUser = { owner, subAccount }
  }
}
