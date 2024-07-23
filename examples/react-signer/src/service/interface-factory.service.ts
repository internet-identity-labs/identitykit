import { IDL } from "@dfinity/candid"
import { Principal } from "@dfinity/principal"
import {
  Actor,
  ActorSubclass,
  Agent,
  Certificate,
  HttpAgent,
  LookupResultFound,
  ReadStateResponse,
} from "@dfinity/agent"
import { GenericError } from "./exception-handler.service"

const CANDID_UI_CANISTER = "a4gq6-oaaaa-aaaab-qaa4q-cai"

class InterfaceFactoryService {
  public async getInterfaceFactory(
    canisterId: string,
    agent: Agent
  ): Promise<IDL.InterfaceFactory> {
    const candidFile: string | undefined = await this.getCandidFile(canisterId, agent as never)
    if (!candidFile) {
      throw new GenericError(`Unable to retrieve candid file for the canister ${canisterId}`)
    }
    const candidJs = await this.transformDidToJs(candidFile, agent as never)
    const dataUri = "data:text/javascript;charset=utf-8," + encodeURIComponent(candidJs)
    const interfaceFactory = await eval('import("' + dataUri + '")')
    return interfaceFactory.idlFactory
  }

  private async getCandidFile(canisterId: string, agent: HttpAgent): Promise<string> {
    const canister = Principal.fromText(canisterId)
    const encoder = new TextEncoder()
    const pathCandid = [
      encoder.encode("canister"),
      canister.toUint8Array().buffer,
      encoder.encode("metadata"),
      encoder.encode("candid:service"),
    ]
    let responseCandid: ReadStateResponse
    try {
      responseCandid = await agent.readState(canister, { paths: [pathCandid] })
    } catch (error) {
      throw new GenericError(
        `Not possible to retrieve candid file from the canister ${canisterId} : ${error}`
      )
    }

    const certificate = await Certificate.create({
      certificate: responseCandid.certificate,
      canisterId: canister,
      rootKey: agent.rootKey,
    })
    const dataCandid = certificate.lookup(pathCandid)
    return new TextDecoder().decode((dataCandid as LookupResultFound).value as ArrayBuffer)
  }

  private async transformDidToJs(candid: string, agent: HttpAgent): Promise<string> {
    const transformInterface: IDL.InterfaceFactory = ({ IDL }) =>
      IDL.Service({
        did_to_js: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ["query"]),
      })
    const didJs: ActorSubclass = Actor.createActor(transformInterface, {
      agent,
      canisterId: CANDID_UI_CANISTER,
    })
    const result = await didJs["did_to_js"](candid)
    if (!result) {
      throw new GenericError("The didtoJs transformation error")
    }
    return (result as string[])[0]
  }
}

export const interfaceFactoryService = new InterfaceFactoryService()
