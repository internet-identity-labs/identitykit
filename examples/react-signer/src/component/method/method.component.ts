import { Dispatch, ReactNode, SetStateAction } from "react"
import { icrc27AccountsMethodComponent } from "./icrc27-accounts-method.component"
import { icrc25RequestPermissionsMethodComponent } from "./icrc25-request-permissions-method.component"
import { ComponentData } from "../../service/method/interactive/interactive-method.service"
import { utilsService } from "../../service/utils.service"
import { icrc34DelegationMethodComponent } from "./icrc34-delegation-method.component"
import { State } from "../../hook/use-signer"
import { icrc49CallCanisterMethodComponent } from "./icrc49-call-canister-method.component"

export interface MethodComponent {
  getMethod(): string
  getComponent(
    componentData: ComponentData,
    setState: Dispatch<SetStateAction<State>>,
    timeout: ReturnType<typeof setTimeout>
  ): ReactNode
}

export const methodComponents: Map<string, MethodComponent> = utilsService.mapByKey(
  (x) => x.getMethod(),
  [
    icrc25RequestPermissionsMethodComponent,
    icrc27AccountsMethodComponent,
    icrc34DelegationMethodComponent,
    icrc49CallCanisterMethodComponent,
  ]
)
