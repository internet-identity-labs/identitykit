import { RPCMessage, RPCSuccessResponse } from "../../../type"
import { ComponentData, InteractiveMethodService } from "./interactive-method.service"
import { Account, accountService } from "../../account.service"
import { GenericError } from "../../exception-handler.service"
import { derivationOriginService } from "../../derivation-origin.service"

export interface AccountsComponentData extends ComponentData {
  accounts: Account[]
}

interface Icrc27Dto {
  icrc95DerivationOrigin: string
}

class Icrc27AccountsMethodService extends InteractiveMethodService {
  public getMethod(): string {
    return "icrc27_accounts"
  }

  public async onApprove(message: MessageEvent<RPCMessage>, data?: unknown): Promise<void> {
    const icrc27Dto = message.data.params as unknown as Icrc27Dto

    if (icrc27Dto.icrc95DerivationOrigin) {
      await derivationOriginService.validate(message.origin, icrc27Dto.icrc95DerivationOrigin)
    }

    const accounts = data as Account[]

    const accountsResponse = accounts.map((x) => {
      return {
        owner: x.principal,
        subaccount: x.subaccount,
      }
    })

    const response: RPCSuccessResponse = {
      origin: message.origin,
      jsonrpc: message.data.jsonrpc,
      id: message.data.id,
      result: {
        accounts: accountsResponse,
      },
    }

    window.opener.postMessage(response, message.origin)
  }

  public async getСomponentData(
    message: MessageEvent<RPCMessage>,
    isAskOnUse: boolean
  ): Promise<AccountsComponentData> {
    const accounts = await accountService.getAccounts()
    if (!accounts) {
      throw new GenericError("User data has not been found")
    }

    const baseData = await super.getСomponentData(message, isAskOnUse)
    return {
      ...baseData,
      accounts,
    }
  }
}

export const icrc27AccountsMethodService = new Icrc27AccountsMethodService()
