import { RequestPermissions } from "../request-permissions.component"
import { PermissionsComponentData } from "../../service/method/interactive/icrc25-request-permissions-method.service"
import { ComponentData } from "../../service/method/interactive/interactive-method.service"
import { MethodComponent } from "./method.component"
import { Dispatch, SetStateAction } from "react"
import { State } from "../../hook/use-signer"

export const icrc25RequestPermissionsMethodComponent: MethodComponent = {
  getMethod(): string {
    return "icrc25_request_permissions"
  },
  getComponent(
    componentData: ComponentData,
    setState: Dispatch<SetStateAction<State>>,
    timeout: ReturnType<typeof setTimeout>
  ) {
    const { origin, permissions, onApprove, onReject } = componentData as PermissionsComponentData
    return (
      <RequestPermissions
        origin={origin}
        permissions={permissions}
        onApprove={onApprove}
        onReject={onReject}
        setState={setState}
        timeout={timeout}
      />
    )
  },
}
