import { ComponentData } from "../../service/method/interactive/interactive-method.service"
import { GetDelegation } from "../get-delegation.component"
import { MethodComponent } from "./method.component"
import { Dispatch, SetStateAction } from "react"
import { State } from "../../hook/use-signer"
import { DelegationComponentData } from "../../service/method/interactive/icrc34-delegation-method.service"
import { PermissionCheck } from "../permission-check.component"

export const icrc34DelegationMethodComponent: MethodComponent = {
  getMethod(): string {
    return "icrc34_delegation"
  },
  getComponent(
    componentData: ComponentData,
    setState: Dispatch<SetStateAction<State>>,
    timeout: ReturnType<typeof setTimeout>
  ) {
    const { origin, accounts, isPublicAccountsAllowed, onApprove, onReject } =
      componentData as DelegationComponentData
    return (
      <PermissionCheck
        methodName={this.getMethod()}
        componentData={componentData}
        timeout={timeout}
      >
        <GetDelegation
          accounts={accounts}
          origin={origin}
          onApprove={onApprove}
          onReject={onReject}
          setState={setState}
          isPublicAccountsAllowed={isPublicAccountsAllowed}
          timeout={timeout}
        />
      </PermissionCheck>
    )
  },
}
