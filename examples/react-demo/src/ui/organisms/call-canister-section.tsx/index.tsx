import { useAgent, useAuth } from "@nfid/identitykit/react"
import { MethodBadge } from "../../atoms"
import { ToTarget } from "./to-target"
import { Ledger } from "./ledger"
import { Icrc2Approve } from "./icrc2-approve"
import { Icrc2Transfer } from "./icrc2-transfer"
import { useState } from "react"
import { DropdownSelect } from "../../molecules"
import {
  CALL_CANISTER_METHODS,
  CallCanisterMethod,
  CallCanisterMethodTitle,
  CallCanisterMethodType,
} from "./constants"

const MethodComponent = {
  [CallCanisterMethod.greet_no_consent]: ToTarget,
  [CallCanisterMethod.transfer]: Ledger,
  [CallCanisterMethod.icrc2_approve]: Icrc2Approve,
  [CallCanisterMethod.icrc2_transfer_from]: Icrc2Transfer,
}

export function CallCanisterSection() {
  const { user } = useAuth()
  const agent = useAgent()
  const [selectedMethod, setSelectedMethod] = useState<CallCanisterMethodType>(
    CallCanisterMethod.greet_no_consent
  )

  return (
    <div
      style={
        !user || !agent
          ? {
              filter: "blur(5px)",
              pointerEvents: "none",
            }
          : undefined
      }
      id="icrc49_call_canister"
    >
      <p className="block text-sm my-[25px]">
        This Method can be used by the relying party to request calls to 3rd party canister executed
        by the signer using the requested identity. In order to prevent misuse of this method all{" "}
        <MethodBadge>icrc49_call_canister</MethodBadge> requests are subject to user approval.
      </p>
      <DropdownSelect
        id="select-request"
        label="Request examples"
        options={CALL_CANISTER_METHODS.filter(
          (k) =>
            import.meta.env.VITE_ENVIRONMENT === "dev" ||
            k !== CallCanisterMethod.icrc2_transfer_from
        ).map((k) => ({
          label: CallCanisterMethodTitle[k],
          value: k,
        }))}
        value={selectedMethod}
        onChange={(value) => setSelectedMethod(value as CallCanisterMethodType)}
      />
      {Object.entries(MethodComponent).map(([key, Component]) => {
        return <Component key={key} className={key !== selectedMethod ? "hidden" : undefined} />
      })}
    </div>
  )
}
