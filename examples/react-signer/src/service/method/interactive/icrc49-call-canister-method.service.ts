import { RPCMessage, RPCSuccessResponse } from "../../../type"
import { ComponentData, InteractiveMethodService } from "./interactive-method.service"
import { accountService } from "../../account.service"
import { callCanisterService } from "../../call-canister.service"
import { DelegationChain, DelegationIdentity, Ed25519KeyIdentity } from "@dfinity/identity"
import { consentMessageService } from "../../consent-message.service"
import { Agent, HttpAgent, Identity } from "@nfid/agent"
import { interfaceFactoryService } from "../../interface-factory.service"
import { IDL } from "@dfinity/candid"
import { GenericError } from "../../exception-handler.service"

const HOUR = 3_600_000
const IC_HOSTNAME = "https://ic0.app"

export interface CallCanisterComponentData extends ComponentData {
  origin: string
  methodName: string
  canisterId: string
  sender: string
  args: string
  consentMessage?: string
}

export interface Icrc49Dto {
  canisterId: string
  sender: string
  method: string
  arg: string
}

class Icrc49CallCanisterMethodService extends InteractiveMethodService {
  public getMethod(): string {
    return "icrc49_call_canister"
  }

  public async onApprove(message: MessageEvent<RPCMessage>): Promise<void> {
    const icrc49Dto = message.data.params as unknown as Icrc49Dto
    const key = await accountService.getAccountKeyIdentityByPrincipal(icrc49Dto.sender)

    if (!key) {
      throw new GenericError("User data has not been found")
    }

    const sessionKey = Ed25519KeyIdentity.generate()
    const chain = await DelegationChain.create(
      key,
      sessionKey.getPublicKey(),
      new Date(Date.now() + 44 * HOUR),
      {}
    )
    const delegation = DelegationIdentity.fromDelegation(sessionKey, chain)

    const agent: Agent = new HttpAgent({
      host: IC_HOSTNAME,
      identity: delegation as unknown as Identity,
    })

    const callResponse = await callCanisterService.call({
      canisterId: icrc49Dto.canisterId,
      calledMethodName: icrc49Dto.method,
      parameters: icrc49Dto.arg,
      delegation,
      agent,
    })

    const response: RPCSuccessResponse = {
      origin: message.origin,
      jsonrpc: message.data.jsonrpc,
      id: message.data.id,
      result: {
        ...callResponse,
      },
    }

    window.opener.postMessage(response, message.origin)
  }

  public async getСomponentData(
    message: MessageEvent<RPCMessage>
  ): Promise<CallCanisterComponentData> {
    const icrc49Dto = message.data.params as unknown as Icrc49Dto

    const key = await accountService.getAccountKeyIdentityByPrincipal(icrc49Dto.sender)

    if (!key) {
      throw new GenericError("User data has not been found")
    }

    const sessionKey = Ed25519KeyIdentity.generate()
    const chain = await DelegationChain.create(
      key,
      sessionKey.getPublicKey(),
      new Date(Date.now() + 44 * HOUR),
      {}
    )
    const delegation = DelegationIdentity.fromDelegation(sessionKey, chain)

    const agent: Agent = new HttpAgent({
      host: IC_HOSTNAME,
      identity: delegation as unknown as Identity,
    })

    const baseData = await super.getСomponentData(message)
    const consentMessage = await consentMessageService.getConsentMessage(
      icrc49Dto.canisterId,
      icrc49Dto.method,
      icrc49Dto.arg,
      agent
    )

    const interfaceFactory = await interfaceFactoryService.getInterfaceFactory(
      icrc49Dto.canisterId,
      agent
    )
    const idl: IDL.ServiceClass = interfaceFactory({ IDL })
    const func: IDL.FuncClass = idl._fields.find((x: unknown[]) => icrc49Dto.method === x[0])![1]
    const argument = JSON.stringify(IDL.decode(func.argTypes, Buffer.from(icrc49Dto.arg, "base64")))

    return {
      ...baseData,
      origin: message.origin,
      methodName: icrc49Dto.method,
      canisterId: icrc49Dto.canisterId,
      sender: icrc49Dto.sender,
      args: argument,
      consentMessage,
    }
  }
}

export const icrc49CallCanisterMethodService = new Icrc49CallCanisterMethodService()
