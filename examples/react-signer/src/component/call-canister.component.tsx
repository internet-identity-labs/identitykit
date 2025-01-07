import { Dispatch, SetStateAction } from "react"
import { InteractivePanel } from "./interactive-panel.component"
import { State } from "../hook/use-signer"

interface CallCanisterRequest {
  origin: string
  onReject: () => Promise<void>
  onApprove: () => Promise<void>
  setState: Dispatch<SetStateAction<State>>
  methodName: string
  canisterId: string
  sender: string
  args: string
  consentMessage?: string
  timeout: ReturnType<typeof setTimeout>
}

export const CallCanister = ({
  origin,
  onApprove,
  onReject,
  setState,
  methodName,
  canisterId,
  sender,
  args,
  consentMessage,
  timeout,
}: CallCanisterRequest) => {
  return (
    <>
      <div className="mb-2 text-xl font-bold text-center">{methodName}</div>
      <small className="block text-center">
        Request from{" "}
        <a className="text-blue-500" target="_blank" href={origin}>
          {origin}
        </a>
      </small>
      <div className="flex flex-col p-5 pb-8 mt-5 space-y-4 rounded-xl bg-neutral-100 text-neutral-500 max-h-96 overflow-auto">
        <div className="flex">
          <small className="block font-bold w-[100px]">Canister ID</small>
          <small>{canisterId}</small>
        </div>
        <div className="flex">
          <small className="block font-bold w-[100px]">Sender</small>
          <small>{sender}</small>
        </div>
        <small className="block font-bold">Arguments</small>
        {args && (
          <div className="flex" key={args}>
            <small>{args}</small>
          </div>
        )}
        {consentMessage && <small className="leading-5">{consentMessage}</small>}
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
