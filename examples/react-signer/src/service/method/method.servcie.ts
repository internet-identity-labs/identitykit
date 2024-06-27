import { utilsService } from "../utils.service"
import { icrc25PermissionsMethodService } from "./silent/icrc25-permissions-method.service"
import { icrc25RequestPermissionsMethodService } from "./interactive/icrc25-request-permissions-method.service"
import { icrc25SupportedStandardsMethodService } from "./silent/icrc25-supported-standards-method.service"
import { icrc27AccountsMethodService } from "./interactive/icrc27-accounts-method.service"
import { ComponentData } from "./interactive/interactive-method.service"
import { RPCMessage } from "../../type"
import { icrc29GetStatusMethodService } from "./silent/icrc29-get-status-method.service"
import { icrc34DelegationMethodService } from "./interactive/icrc34-delegation-method.service"
import { icrc49CallCanisterMethodService } from "./interactive/icrc49-call-canister-method.service"

export interface MethodService {
  getMethod(): string
  invokeAndGetComponentData(message: MessageEvent<RPCMessage>): Promise<ComponentData | undefined>
}

export const methodServices: Map<string, MethodService> = utilsService.mapByKey(
  (x) => x.getMethod(),
  [
    icrc25RequestPermissionsMethodService,
    icrc25PermissionsMethodService,
    icrc25SupportedStandardsMethodService,
    icrc27AccountsMethodService,
    icrc29GetStatusMethodService,
    icrc34DelegationMethodService,
    icrc49CallCanisterMethodService,
  ]
)
