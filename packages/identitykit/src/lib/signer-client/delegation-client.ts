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
  SignerStorage,
  getDelegationChain,
  getIdentity,
  removeDelegationChain,
  removeIdentity,
  setDelegationChain,
  setIdentity,
} from "@slide-computer/signer-storage"
import { STORAGE_KEY, SignerClient, SignerClientOptions } from "./client"
import { DelegationRequest, DelegationResponse, fromBase64, toBase64 } from "@slide-computer/signer"
import { type Signature } from "@dfinity/agent"
import { DEFAULT_MAX_TIME_TO_LIVE } from "../constants"
import { IdleManager } from "../timeout-managers/idle-manager"
import { TimeoutManager } from "../timeout-managers/timeout-manager"

const ECDSA_KEY_LABEL = "ECDSA"
const ED25519_KEY_LABEL = "Ed25519"
type BaseKeyType = typeof ECDSA_KEY_LABEL | typeof ED25519_KEY_LABEL

export enum DelegationType {
  ACCOUNT = "ACCOUNT",
  RELYING_PARTY = "RELYING_PARTY",
}

const NANOS_IN_MILLIS = BigInt(1000000)

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
  /**
   * Expiration of the delegation in nanoseconds
   */
  maxTimeToLive?: bigint
}

export class DelegationSignerClient extends SignerClient {
  private expirationManager?: TimeoutManager

  constructor(
    options: SignerClientOptions,
    private identity: Identity | PartialIdentity,
    private baseIdentity: SignIdentity | PartialIdentity,
    private targets?: string[],
    private maxTimeToLive: bigint = BigInt(DEFAULT_MAX_TIME_TO_LIVE)
  ) {
    // TODO for delegation use delegation expiration as idle timeout
    super(options)
  }

  public static async create(
    options: DelegationSignerClientOptions
  ): Promise<DelegationSignerClient> {
    const storage = options.storage ?? new IdbStorage()
    let baseIdentity = options.identity
    let identity = new AnonymousIdentity()
    if (this.shouldCheckIsUserConnected() && !baseIdentity) {
      baseIdentity = await getIdentity(STORAGE_KEY, storage as SignerStorage)
    }
    if (!baseIdentity) {
      const createdBaseIdentity = await (!options?.keyType || options?.keyType === ED25519_KEY_LABEL
        ? Ed25519KeyIdentity.generate(crypto.getRandomValues(new Uint8Array(32)))
        : ECDSAKeyIdentity.generate())
      baseIdentity = createdBaseIdentity
    }
    if (this.shouldCheckIsUserConnected()) {
      const delegationChain = await getDelegationChain(STORAGE_KEY, storage as SignerStorage)
      const delegationValid = baseIdentity && delegationChain && isDelegationValid(delegationChain)
      identity = delegationValid
        ? DelegationSignerClient.createIdentity(baseIdentity, delegationChain)
        : new AnonymousIdentity()

      const signerClient = new DelegationSignerClient(
        options,
        identity,
        baseIdentity,
        options.targets,
        options.maxTimeToLive
      )

      if (delegationValid) {
        signerClient.initExpirationManager(delegationChain)
      }

      const storageConnectedUser = await signerClient.getConnectedUserFromStorage()
      await signerClient.setConnectedUser(storageConnectedUser)

      return signerClient
    }

    const signerClient = new DelegationSignerClient(
      options,
      identity,
      baseIdentity,
      options.targets,
      options.maxTimeToLive
    )

    return signerClient
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

  public async login(): Promise<void> {
    const params = this.options.derivationOrigin
      ? {
          derivationOrigin: this.options.derivationOrigin,
        }
      : {}
    const delegationChainResponse = await this.options.signer.sendRequest<
      DelegationRequest,
      DelegationResponse
    >({
      id: this.crypto.randomUUID(),
      jsonrpc: "2.0",
      method: "icrc34_delegation",
      params: {
        ...params,
        publicKey: toBase64(this.baseIdentity.getPublicKey().toDer()),
        targets: this.targets,
        maxTimeToLive: this.maxTimeToLive === undefined ? undefined : String(this.maxTimeToLive),
      },
    })

    if ("error" in delegationChainResponse) {
      throw Error(delegationChainResponse.error.message)
    }

    const delegationChain = DelegationChain.fromDelegations(
      delegationChainResponse.result.signerDelegation.map((delegation) => {
        return {
          delegation: new Delegation(
            fromBase64(delegation.delegation.pubkey),
            BigInt(delegation.delegation.expiration),
            delegation.delegation.targets?.map((principal) => Principal.fromText(principal))
          ),
          signature: fromBase64(delegation.signature) as Signature,
        }
      }),
      fromBase64(delegationChainResponse.result.publicKey)
    )

    if (
      this.baseIdentity instanceof Ed25519KeyIdentity ||
      this.baseIdentity instanceof ECDSAKeyIdentity
    ) {
      await setIdentity(STORAGE_KEY, this.baseIdentity, this.storage)
    }

    await setDelegationChain(STORAGE_KEY, delegationChain, this.storage)
    this.identity = DelegationSignerClient.createIdentity(this.baseIdentity, delegationChain)

    await this.setConnectedUserToStorage({ owner: this.identity.getPrincipal().toString() })

    if (!this.options?.idleOptions?.disableIdle && !this.idleManager) {
      this.idleManager = new IdleManager(this.options.idleOptions)
      this.registerDefaultIdleCallback()
    }

    return this.initExpirationManager(delegationChain)
  }

  private initExpirationManager(delegationChain: DelegationChain): void {
    if (!this.expirationManager) {
      const delegationExpirationInMillis =
        Number(
          delegationChain.delegations.reduce(
            (acc, value) => {
              const bigIntValue = BigInt(value.delegation.expiration) / NANOS_IN_MILLIS
              return bigIntValue > acc ? bigIntValue : acc
            },
            BigInt(delegationChain.delegations[0].delegation.expiration) / NANOS_IN_MILLIS
          )
        ) - Date.now()

      this.expirationManager = new TimeoutManager({ timeout: delegationExpirationInMillis })
      this.expirationManager?.registerCallback(async () => {
        await this.logout()
      })
    }
  }

  public async logout(options?: { returnTo?: string }): Promise<void> {
    await Promise.all([
      removeIdentity(STORAGE_KEY, this.storage),
      removeDelegationChain(STORAGE_KEY, this.storage),
    ])
    this.identity = new AnonymousIdentity()
    return super.logout(options)
  }

  public getIdentity(): Identity | PartialIdentity {
    return this.identity
  }

  public async getDelegationType() {
    if (!this.connectedUser) throw new Error("Not authorized")
    const delegationChain = await getDelegationChain(STORAGE_KEY, this.storage)
    if (!delegationChain) throw new Error("Not authorized")
    return delegationChain.delegations[0].delegation.targets?.length
      ? DelegationType.ACCOUNT
      : DelegationType.RELYING_PARTY
  }

  public async getDelegation() {
    const chain = await getDelegationChain(STORAGE_KEY, this.storage)
    return chain?.delegations[0]
  }
}
