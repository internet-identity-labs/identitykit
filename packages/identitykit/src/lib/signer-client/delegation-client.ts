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
  Delegation,
} from "@dfinity/identity"
import {
  IdbStorage,
  getDelegationChain,
  getIdentity,
  removeDelegationChain,
  removeIdentity,
  setDelegationChain,
  setIdentity,
} from "@slide-computer/signer-storage"
import { IdleManager } from "./idle-manager"
import { STORAGE_KEY, SignerClient, SignerClientOptions } from "./client"
import { DelegationRequest, DelegationResponse, fromBase64, toBase64 } from "@slide-computer/signer"
import { type Signature } from "@dfinity/agent"

const ECDSA_KEY_LABEL = "ECDSA"
const ED25519_KEY_LABEL = "Ed25519"
type BaseKeyType = typeof ECDSA_KEY_LABEL | typeof ED25519_KEY_LABEL

export interface DelegationSignerClientOptions extends SignerClientOptions {
  /**
   * An identity to use as the base
   */
  identity?: SignIdentity | PartialIdentity
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
    options: SignerClientOptions,
    private identity: Identity | PartialIdentity,
    private keyType: BaseKeyType,
    private targets: string[] | undefined
  ) {
    super(options)
  }

  public static async create(
    options: DelegationSignerClientOptions
  ): Promise<DelegationSignerClient> {
    const storage = options.storage ?? new IdbStorage()
    if (SignerClient.shouldCheckIsUserConnected()) {
      const baseIdentity = options.identity ?? (await getIdentity(STORAGE_KEY, storage))
      const delegationChain = await getDelegationChain(STORAGE_KEY, storage)
      const identity =
        baseIdentity && delegationChain && isDelegationValid(delegationChain)
          ? DelegationSignerClient.createIdentity(baseIdentity, delegationChain)
          : new AnonymousIdentity()

      const signerClient = new DelegationSignerClient(
        options,
        identity,
        options.keyType ?? ED25519_KEY_LABEL,
        options.targets
      )

      const storageConnectedUser = await signerClient.getConnectedUserFromStorage()
      await signerClient.setConnectedUser(storageConnectedUser)

      return signerClient
    } else {
      const identity = new AnonymousIdentity()
      const signerClient = new DelegationSignerClient(
        options,
        identity,
        options.keyType ?? ED25519_KEY_LABEL,
        options.targets
      )

      return signerClient
    }
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

  public async login(options?: {
    /**
     * Expiration of the authentication in nanoseconds
     * @default  BigInt(8) hours * BigInt(3_600_000_000_000) nanoseconds
     */
    maxTimeToLive?: bigint
  }): Promise<{ signerResponse: DelegationChain; connectedAccount: string }> {
    const baseIdentity = await this.getBaseIdentity()
    const delegationChainResponse = await this.options.signer.sendRequest<
      DelegationRequest,
      DelegationResponse
    >({
      id: this.crypto.randomUUID(),
      jsonrpc: "2.0",
      method: "icrc34_delegation",
      params: {
        publicKey: toBase64(baseIdentity.getPublicKey().toDer()),
        targets: this.targets,
        maxTimeToLive:
          options?.maxTimeToLive === undefined ? undefined : String(options.maxTimeToLive),
      },
    })

    if ("error" in delegationChainResponse) {
      throw Error(delegationChainResponse.error.message)
    }

    const delegationChain = DelegationChain.fromDelegations(
      delegationChainResponse.result.signerDelegation.map((delegation) => ({
        delegation: new Delegation(
          fromBase64(delegation.delegation.pubkey),
          BigInt(delegation.delegation.expiration),
          delegation.delegation.targets?.map((principal) => Principal.fromText(principal))
        ),
        signature: fromBase64(delegation.signature) as Signature,
      })),
      fromBase64(delegationChainResponse.result.publicKey)
    )

    if (baseIdentity instanceof Ed25519KeyIdentity || baseIdentity instanceof ECDSAKeyIdentity) {
      await setIdentity(STORAGE_KEY, baseIdentity, this.storage)
    }
    await setDelegationChain(STORAGE_KEY, delegationChain, this.storage)
    this.identity = DelegationSignerClient.createIdentity(baseIdentity, delegationChain)

    await this.setConnectedUserToStorage({ owner: this.identity.getPrincipal().toString() })

    if (!this.options?.idleOptions?.disableIdle && !this.idleManager) {
      this.idleManager = IdleManager.create(this.options.idleOptions)
      this.registerDefaultIdleCallback()
    }

    return {
      signerResponse: delegationChain,
      connectedAccount: this.identity.getPrincipal().toString(),
    }
  }

  public async logout(options?: { returnTo?: string }): Promise<void> {
    await removeIdentity(STORAGE_KEY, this.storage)
    await removeDelegationChain(STORAGE_KEY, this.storage)
    this.identity = new AnonymousIdentity()
    super.logout(options)
  }

  private async getBaseIdentity() {
    if (this.options.identity) {
      return this.options.identity
    }
    // TODO could be better, need to get rid of all async calls between login and signer select
    if (SignerClient.shouldCheckIsUserConnected()) {
      const baseIdentity = await getIdentity(STORAGE_KEY, this.storage)
      if (baseIdentity) {
        return baseIdentity
      }
    }
    return this.createBaseIdentity()
  }

  private async createBaseIdentity() {
    const baseIdentity = await (this.keyType === ED25519_KEY_LABEL
      ? Ed25519KeyIdentity.generate(this.crypto.getRandomValues(new Uint8Array(32)))
      : ECDSAKeyIdentity.generate())
    return baseIdentity
  }

  public getDelegationChain(): Promise<DelegationChain | undefined> {
    return getDelegationChain(STORAGE_KEY, this.storage)
  }
}
