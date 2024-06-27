import { Dispatch, SetStateAction } from "react"
import { InteractivePanel } from "./interactive-panel.component"
import { State } from "../hook/use-signer"

interface RequestPermissionsRequest {
  origin: string
  permissions: string[]
  revoke?: boolean
  timeout: ReturnType<typeof setTimeout>
  onReject: () => Promise<void>
  onApprove: () => Promise<void>
  setState: Dispatch<SetStateAction<State>>
}

export const RequestPermissions = ({
  origin,
  permissions,
  revoke,
  timeout,
  onApprove,
  onReject,
  setState,
}: RequestPermissionsRequest) => {
  const text = revoke ? "Revoke" : "Request"
  return (
    <>
      <div className="mb-2 text-xl font-bold text-center">{text} Permission</div>
      <small className="block text-center">
        <a className="text-blue-500" target="_blank" href={origin}>
          {origin}
        </a>{" "}
        wants permission to {text.toLowerCase()} the following methods:
      </small>
      <div className="rounded border border-solid border-neutral-300 py-2.5 px-5 mt-8">
        <ul className="themed">
          {permissions.map((p) => (
            <li key={p}>
              <small className="font-bold">{p}</small>
            </li>
          ))}
        </ul>
      </div>
      <InteractivePanel
        onApprove={onApprove}
        onReject={onReject}
        setState={setState}
        timeout={timeout}
      />
    </>
  )
}
