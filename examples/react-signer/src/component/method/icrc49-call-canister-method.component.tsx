import { ComponentData } from "../../service/method/interactive/interactive-method.service"
import { MethodComponent } from "./method.component"
import { Dispatch, SetStateAction } from "react"
import { State } from "../../hook/use-signer"
import { CallCanisterComponentData } from "../../service/method/interactive/icrc49-call-canister-method.service"
import { CallCanister } from "../call-canister.component"
import { PermissionCheck } from "../permission-check.component"

export const icrc49CallCanisterMethodComponent: MethodComponent = {
  getMethod(): string {
    return "icrc49_call_canister"
  },
  getComponent(
    componentData: ComponentData,
    setState: Dispatch<SetStateAction<State>>,
    timeout: ReturnType<typeof setTimeout>
  ) {
    const { origin, methodName, canisterId, sender, args, consentMessage, onApprove, onReject } =
      componentData as CallCanisterComponentData
    return (
      <PermissionCheck
        methodName={this.getMethod()}
        componentData={componentData}
        timeout={timeout}
      >
        <CallCanister
          origin={origin}
          onApprove={onApprove}
          onReject={onReject}
          setState={setState}
          methodName={methodName}
          canisterId={canisterId}
          sender={sender}
          args={args}
          consentMessage={consentMessage}
          timeout={timeout}
        />
      </PermissionCheck>
    )
  },
}
