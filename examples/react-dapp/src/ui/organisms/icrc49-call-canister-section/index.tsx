import { useState } from "react"
import { WithoutConsentMessage } from "./without-consent-message"
import { Ledger } from "./ledger"
import { Icrc2Approve } from "./icrc2-approve"
import { Icrc2Transfer } from "./icrc2-transfer"
import { WithConsentMessage } from "./with-consent-message"
import { DropdownSelect } from "../../molecules"
import {
  CallCanisterMethod,
  CALL_CANISTER_METHODS,
  CallCanisterMethodTitle,
  CallCanisterMethodType,
} from "./constants"
import { MethodBadge } from "../../atoms"

const MethodComponent = {
  [CallCanisterMethod.greet_no_consent]: WithoutConsentMessage,
  [CallCanisterMethod.transfer]: Ledger,
  [CallCanisterMethod.icrc2_approve]: Icrc2Approve,
  [CallCanisterMethod.icrc2_transfer_from]: Icrc2Transfer,
  [CallCanisterMethod.greet]: WithConsentMessage,
}

export function Icrc49CallCanisterSection() {
  const [selectedMethod, setSelectedMethod] = useState<CallCanisterMethodType>(
    CallCanisterMethod.greet_no_consent
  )

  const Component = MethodComponent[selectedMethod]

  return (
    <div>
      <h2 className="mb-5 text-xl font-normal">4.a icrc49_call_canister</h2>
      <div className="text-sm leading-[22px] mb-5">
        This Method can be used by the relying party to request calls to 3rd party canister executed
        by the signer using the requested identity. In order to prevent misuse of this method all{" "}
        <MethodBadge>icrc49_call_canister</MethodBadge> requests are subject to user approval.
      </div>
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
      <Component />
    </div>
  )
}
