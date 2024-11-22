import { RPCMessage, RPCSuccessResponse } from "../../../type"
import { ComponentData, InteractiveMethodService } from "./interactive-method.service"
import { Account, AccountKeyIdentity, AccountType, accountService } from "../../account.service"
import { DelegationChain, Ed25519PublicKey } from "@dfinity/identity"
import { Principal } from "@dfinity/principal"
import { targetService } from "../../target.service"
import { GenericError } from "../../exception-handler.service"
import { derivationOriginService } from "../../derivation-origin.service"

export interface DelegationComponentData extends ComponentData {
  accounts: Account[]
  isPublicAccountsAllowed: boolean
}

interface Icrc34Dto {
  publicKey: string
  targets: string[]
  maxTimeToLive: string
  icrc95DerivationOrigin: string
}

const MAX_TIME_TO_LIVE_MILLIS = 28800000 // 8 hours
const NANOS_IN_MILLIS = 1000000

class Icrc34DelegationMethodService extends InteractiveMethodService {
  public getMethod(): string {
    return "icrc34_delegation"
  }

  public async onApprove(message: MessageEvent<RPCMessage>, data?: unknown): Promise<void> {
    const icrc34Dto = message.data.params as unknown as Icrc34Dto

    icrc34Dto.icrc95DerivationOrigin &&
      (await derivationOriginService.validate(icrc34Dto.icrc95DerivationOrigin, message.origin))

    const account = (data as Account[])[0]
    const accountKeyIdentity = await accountService.getAccountKeyIdentityById(account.id)

    if (!accountKeyIdentity) {
      throw new GenericError("User data has not been found")
    }

    const sessionPublicKey = Ed25519PublicKey.fromDer(this.fromBase64(icrc34Dto.publicKey))
    const chain = await this.getChain(accountKeyIdentity, icrc34Dto, sessionPublicKey)

    const response: RPCSuccessResponse = {
      origin: message.origin,
      jsonrpc: message.data.jsonrpc,
      id: message.data.id,
      result: this.formatDelegationChain(chain),
    }

    window.opener.postMessage(response, message.origin)
  }

  public async getСomponentData(
    message: MessageEvent<RPCMessage>,
    isAskOnUse: boolean
  ): Promise<DelegationComponentData> {
    const icrc34Dto = message.data.params as unknown as Icrc34Dto

    try {
      Ed25519PublicKey.fromDer(this.fromBase64(icrc34Dto.publicKey))
    } catch (e) {
      console.error("Icrc34DelegationMethodService getСomponentData", e)
      throw new GenericError("Incorrect public key")
    }

    const accounts = await accountService.getAccounts()
    const isPublicAccountsAllowed = await this.isPublicAccountsAllowed(
      icrc34Dto.targets,
      message.origin
    )

    if (!accounts) {
      throw new GenericError("User data has not been found")
    }

    const baseData = await super.getСomponentData(message, isAskOnUse)
    return {
      ...baseData,
      accounts,
      isPublicAccountsAllowed,
    }
  }

  private formatDelegationChain(chain: DelegationChain) {
    return {
      signerDelegation: chain.delegations.map((signedDelegation) => {
        const { delegation, signature } = signedDelegation
        const { targets } = delegation
        return {
          delegation: Object.assign(
            {
              expiration: delegation.expiration,
              pubkey: this.toBase64(delegation.pubkey),
            },
            targets && {
              targets: targets.map((t) => t.toText()),
            }
          ),
          signature: this.toBase64(signature),
        }
      }),
      publicKey: this.toBase64(chain.publicKey),
    }
  }

  private async isPublicAccountsAllowed(targets: string[], origin: string) {
    if (!targets || targets.length === 0) return false

    try {
      await targetService.validateTargets(targets, origin)
      return true
    } catch (e: unknown) {
      const text = e instanceof Error ? e.message : "Unknown error"
      console.error("The targets cannot be validated:", text)
      return false
    }
  }

  private async getChain(
    accountKeyIdentity: AccountKeyIdentity,
    icrc34Dto: Icrc34Dto,
    sessionPublicKey: Ed25519PublicKey
  ): Promise<DelegationChain> {
    const maxTimeToLive = icrc34Dto.maxTimeToLive
      ? Number(icrc34Dto.maxTimeToLive) / NANOS_IN_MILLIS
      : MAX_TIME_TO_LIVE_MILLIS

    if (accountKeyIdentity.type === AccountType.GLOBAL) {
      const targets = icrc34Dto.targets.map((x) => Principal.fromText(x))

      return await DelegationChain.create(
        accountKeyIdentity.keyIdentity,
        sessionPublicKey,
        new Date(Date.now() + maxTimeToLive),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { targets: targets as any }
      )
    }

    return await DelegationChain.create(
      accountKeyIdentity.keyIdentity,
      sessionPublicKey,
      new Date(Date.now() + maxTimeToLive)
    )
  }

  private fromBase64(base64: string): ArrayBuffer {
    if (typeof globalThis.Buffer !== "undefined") {
      return globalThis.Buffer.from(base64, "base64").buffer
    }
    if (typeof globalThis.atob !== "undefined") {
      return Uint8Array.from(globalThis.atob(base64), (m) => m.charCodeAt(0)).buffer
    }
    throw Error("Could not decode base64 string")
  }

  private toBase64(bytes: ArrayBuffer): string {
    if (typeof globalThis.Buffer !== "undefined") {
      return globalThis.Buffer.from(bytes).toString("base64")
    }
    if (typeof globalThis.btoa !== "undefined") {
      return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    }
    throw Error("Could not encode base64 string")
  }
}

export const icrc34DelegationMethodService = new Icrc34DelegationMethodService()
