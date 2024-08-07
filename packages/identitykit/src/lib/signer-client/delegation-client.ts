import { AnonymousIdentity, type Identity, type SignIdentity } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import {
  DelegationChain,
  DelegationIdentity,
  ECDSAKeyIdentity,
  Ed25519KeyIdentity,
  isDelegationValid,
  PartialDelegationIdentity,
  PartialIdentity,
} from "@dfinity/identity"
import {
  IdbStorage,
  SignerStorage,
  getDelegationChain,
  getIdentity,
  removeDelegationChain,
  removeIdentity,
  setDelegationChain,
  setIdentity,
} from "@slide-computer/signer-storage"
import { IdleManager } from "./idle-manager"
import {
  STORAGE_CONNECTED_OWNER_KEY,
  STORAGE_KEY,
  SignerClient,
  SignerClientOptions,
} from "./client"

const ECDSA_KEY_LABEL = "ECDSA"
const ED25519_KEY_LABEL = "Ed25519"
type BaseKeyType = typeof ECDSA_KEY_LABEL | typeof ED25519_KEY_LABEL

export interface DelegationSignerClientOptions extends SignerClientOptions {
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
   * type to use for the base key
   * @default 'ECDSA'
   * If you are using a custom storage provider that does not support CryptoKey storage,
   * you should use 'Ed25519' as the key type, as it can serialize to a string
   */
  keyType?: BaseKeyType
  targets?: string[]
}

export class DelegationSignerClient extends SignerClient {
  constructor(
    options: DelegationSignerClientOptions,
    storage: SignerStorage,
    private keyType: BaseKeyType,
    private identity: Identity | PartialIdentity,
    private targets: string[] | undefined,
    public connectedUser: { owner: string } | undefined
  ) {
    super(options, storage)
  }

  private get crypto(): Pick<Crypto, "getRandomValues"> {
    return this.options.crypto ?? globalThis.crypto
  }

  public static async create(options: DelegationSignerClientOptions): Promise<SignerClient> {
    const storage = options.storage ?? new IdbStorage()
    const baseIdentity = options.identity ?? (await getIdentity(STORAGE_KEY, storage))
    const delegationChain = await getDelegationChain(STORAGE_KEY, storage)
    const identity =
      baseIdentity && delegationChain && isDelegationValid(delegationChain)
        ? DelegationSignerClient.createIdentity(baseIdentity, delegationChain)
        : new AnonymousIdentity()

    const connectedUser = await DelegationSignerClient.getConnectedUser(storage)

    return new DelegationSignerClient(
      options,
      storage,
      options.keyType ?? "Ed25519",
      identity,
      options.targets,
      connectedUser
    )
  }

  private static createIdentity(
    baseIdentity: SignIdentity | PartialIdentity,
    delegationChain: DelegationChain
  ) {
    if (baseIdentity instanceof PartialIdentity) {
      return PartialDelegationIdentity.fromDelegation(baseIdentity, delegationChain)
    }
    return DelegationIdentity.fromDelegation(baseIdentity, delegationChain)
  }

  public static async getConnectedUser(
    storage: SignerStorage
  ): Promise<{ owner: string } | undefined> {
    const storageValue = await storage.get(STORAGE_CONNECTED_OWNER_KEY)
    if (!storageValue) return undefined
    return {
      owner: storageValue as string,
    }
  }

  public async login(options?: {
    /**
     * Expiration of the authentication in nanoseconds
     * @default  BigInt(8) hours * BigInt(3_600_000_000_000) nanoseconds
     */
    maxTimeToLive?: bigint
  }): Promise<string> {
    const baseIdentity = await this.getBaseIdentity()
    const permissions = await this.options.signer.permissions()

    // TODO hot fix for nfid wallet, permissions have old format
    if (
      !permissions.find((x) =>
        x.scope
          ? "icrc34_delegation" === x.scope.method
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            "icrc34_delegation" === (x as any).method
      )
    ) {
      await this.options.signer.requestPermissions([
        {
          method: "icrc34_delegation",
        },
      ])
    }
    const delegationChain = await this.options.signer.delegation({
      publicKey: baseIdentity.getPublicKey().toDer(),
      maxTimeToLive: options?.maxTimeToLive,
      targets: this.targets?.map((t) => Principal.from(t)),
    })
    await setDelegationChain(STORAGE_KEY, delegationChain, this.storage)
    this.identity = DelegationSignerClient.createIdentity(baseIdentity, delegationChain)

    await this.setConnectedUser(this.identity.getPrincipal().toString())

    if (!this.options?.idleOptions?.disableIdle && !this.idleManager) {
      this.idleManager = IdleManager.create(this.options.idleOptions)
      this.registerDefaultIdleCallback()
    }

    return this.identity.getPrincipal().toString()
  }

  public async logout(options: { returnTo?: string } = {}): Promise<void> {
    await removeIdentity(STORAGE_KEY, this.storage)
    await removeDelegationChain(STORAGE_KEY, this.storage)
    await this.storage.remove(STORAGE_CONNECTED_OWNER_KEY)
    this.identity = new AnonymousIdentity()
    this.connectedUser = undefined
    this.idleManager?.exit()
    this.idleManager = undefined
    if (options.returnTo) {
      try {
        window.history.pushState({}, "", options.returnTo)
      } catch (e) {
        window.location.href = options.returnTo
      }
    }
  }

  private async getBaseIdentity() {
    if (this.options.identity) {
      return this.options.identity
    }
    const baseIdentity = await getIdentity(STORAGE_KEY, this.storage)
    if (baseIdentity) {
      return baseIdentity
    }
    return this.createBaseIdentity()
  }

  private async createBaseIdentity() {
    const baseIdentity = await (this.keyType === "Ed25519"
      ? Ed25519KeyIdentity.generate(this.crypto.getRandomValues(new Uint8Array(32)))
      : ECDSAKeyIdentity.generate())
    await setIdentity(STORAGE_KEY, baseIdentity, this.storage)
    return baseIdentity
  }
}
