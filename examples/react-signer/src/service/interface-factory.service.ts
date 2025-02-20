import { IDL } from "@dfinity/candid"
import { Principal } from "@dfinity/principal"
import {
  Actor,
  ActorMethod,
  ActorSubclass,
  Certificate,
  HttpAgent,
  IC_ROOT_KEY,
  LookupResultFound,
  ReadStateResponse,
} from "@dfinity/agent"
import { GenericError } from "./exception-handler.service"

const CANDID_UI_CANISTER = "a4gq6-oaaaa-aaaab-qaa4q-cai"

interface Canister {
  __get_candid_interface_tmp_hack: ActorMethod<[], string>
}

const CANISTER_INTERFACE: IDL.InterfaceFactory = ({ IDL }) =>
  IDL.Service({
    __get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ["query"]),
  })

class InterfaceFactoryService {
  public async getInterfaceFactory(
    canisterId: string,
    agent: HttpAgent
  ): Promise<IDL.InterfaceFactory> {
    let candidFile: string

    try {
      candidFile = await this.getCandidFile(canisterId, agent)
    } catch (e) {
      console.warn(
        "The candid file cannot be received in a default way, trying Dfinity's getDidJsFromTmpHack.",
        e
      )

      const candidFileMaybe = await this.getDidJsFromTmpHack(Principal.fromText(canisterId), agent)

      if (!candidFileMaybe) {
        throw new GenericError(`Unable to retrieve candid file for the canister ${canisterId}`)
      }

      candidFile = candidFileMaybe
    }

    const candidJs = await this.transformDidToJs(candidFile, agent)
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
      rootKey:
        agent.rootKey ??
        new Uint8Array(IC_ROOT_KEY.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16))).buffer,
    })
    const dataCandid = certificate.lookup(pathCandid)
    const candidFileMabye = new TextDecoder().decode(
      (dataCandid as LookupResultFound).value as ArrayBuffer
    )

    if (!candidFileMabye) {
      throw new GenericError("Empty candid file has been received.")
    }

    return candidFileMabye
  }

  private async getDidJsFromTmpHack(
    canisterId: Principal,
    agent: HttpAgent
  ): Promise<undefined | string> {
    const actor: ActorSubclass<Canister> = Actor.createActor<Canister>(CANISTER_INTERFACE, {
      agent,
      canisterId,
    })
    const candid = await actor.__get_candid_interface_tmp_hack()
    return candid
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
