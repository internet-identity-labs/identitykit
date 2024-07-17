import { RPCMessage, RPCSuccessResponse } from "../../../type"
import { ComponentData, InteractiveMethodService } from "./interactive-method.service"
import { Account, AccountKeyIdentity, AccountType, accountService } from "../../account.service"
import { DelegationChain, Ed25519PublicKey } from "@dfinity/identity"
import { Principal } from "@dfinity/principal"
import { targetService } from "../../target.service"
import { GenericError } from "../../exception-handler.service"
import { fromBase64, toBase64 } from "@slide-computer/signer"

export interface DelegationComponentData extends ComponentData {
  accounts: Account[]
  isPublicAccountsAllowed: boolean
}

export interface Icrc34Dto {
  publicKey: string
  targets: string[]
  maxTimeToLive: string
}

class Icrc34DelegationMethodService extends InteractiveMethodService {
  public getMethod(): string {
    return "icrc34_delegation"
  }

  public async onApprove(message: MessageEvent<RPCMessage>, data?: unknown): Promise<void> {
    const icrc34Dto = message.data.params as unknown as Icrc34Dto
    const account = (data as Account[])[0]
    const accountKeyIdentity = await accountService.getAccountKeyIdentityById(account.id)

    if (!accountKeyIdentity) {
      throw new GenericError("User data has not been found")
    }

    const sessionPublicKey = Ed25519PublicKey.fromDer(fromBase64(icrc34Dto.publicKey))
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
    message: MessageEvent<RPCMessage>
  ): Promise<DelegationComponentData> {
    const icrc34Dto = message.data.params as unknown as Icrc34Dto
    const accounts = await accountService.getAccounts()
    const isPublicAccountsAllowed = await this.isPublicAccountsAllowed(
      icrc34Dto.targets,
      message.origin
    )

    if (!accounts) {
      throw new GenericError("User data has not been found")
    }

    const baseData = await super.getСomponentData(message)
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
              pubkey: toBase64(delegation.pubkey),
            },
            targets && {
              targets: targets.map((t) => t.toText()),
            }
          ),
          signature: toBase64(signature),
        }
      }),
      publicKey: toBase64(chain.publicKey),
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
    const maxTimeToLive = icrc34Dto.maxTimeToLive ? Number(icrc34Dto.maxTimeToLive) : 28800000000000

    if (accountKeyIdentity.type === AccountType.GLOBAL) {
      const targets = icrc34Dto.targets.map((x) => Principal.fromText(x))

      return await DelegationChain.create(
        accountKeyIdentity.keyIdentity,
        sessionPublicKey,
        new Date(Date.now() + maxTimeToLive),
        { targets }
      )
    }

    return await DelegationChain.create(
      accountKeyIdentity.keyIdentity,
      sessionPublicKey,
      new Date(Date.now() + maxTimeToLive)
    )
  }
}

export const icrc34DelegationMethodService = new Icrc34DelegationMethodService()
