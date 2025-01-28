import React, { useState, useCallback } from "react"
import { ComponentData } from "../service/method/interactive/interactive-method.service"
import { RequestPermissions } from "./request-permissions.component"

type PermissionCheckRequest = React.PropsWithChildren<{
  methodName: string
  componentData: ComponentData
  timeout: ReturnType<typeof setTimeout>
}>

export const PermissionCheck: React.FC<PermissionCheckRequest> = ({
  methodName,
  componentData,
  timeout,
  children,
}: PermissionCheckRequest) => {
  const { origin, isAskOnUse, onApprovePermission, onRejectPermission } =
    componentData as ComponentData
  const [isAllowed, setAllowed] = useState(!isAskOnUse)

  const onApprove = useCallback(async () => {
    await onApprovePermission()
    setAllowed(true)
  }, [onApprovePermission])

  return (
    <>
      {isAllowed ? (
        children
      ) : (
        <RequestPermissions
          origin={origin}
          permissions={[methodName]}
          onApprove={onApprove}
          onReject={onRejectPermission}
          setState={() => {}}
          timeout={timeout}
        />
      )}
    </>
  )
}
