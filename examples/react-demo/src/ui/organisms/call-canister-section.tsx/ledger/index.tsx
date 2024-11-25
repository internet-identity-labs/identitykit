import { Section } from "../section"
import { idlFactory as ledgerIDL } from "../../../../idl/ledger"
import { useAuth } from "@nfid/identitykit/react"
import { CallCanisterMethod } from "../constants"
import { e8s, LEDGER_CANISTER_ID } from "../../../../constants"
import { useFormik } from "formik"
import { Form, FormValues } from "./form"
import { toBase64 } from "@nfid/identitykit"
import { fromHexString, IDL } from "@dfinity/candid"
import { AccountIdentifier, SubAccount } from "@dfinity/ledger-icp"
import { Principal } from "@dfinity/principal"

import * as yup from "yup"
import {
  numberValidation,
  principalValidation,
  subAccountValidation,
} from "../../../../validations"

const schema = yup
  .object({
    to_principal: principalValidation().required("field is required"),
    to_subaccount: subAccountValidation(),
    fee: numberValidation().required("field is required"),
    amount: numberValidation().required("field is required"),
    memo: numberValidation().required("field is required"),
    from_subaccount: subAccountValidation(),
    created_at_time: numberValidation(),
  })
  .required()

const initialValues = {
  to_principal: import.meta.env.VITE_TARGET_CANISTER,
  to_subaccount: "",
  fee: (0.0001 * e8s).toString(),
  amount: (1 * e8s).toString(),
  memo: "0",
  from_subaccount: "",
  created_at_time: "",
}

export function Ledger({ className }: { className?: string }) {
  const { user } = useAuth()
  const { values, errors, isValid, isValidating, handleChange, handleBlur, setValues } =
    useFormik<FormValues>({
      initialValues,
      validationSchema: schema,
      onSubmit: () => {},
    })

  const { to_principal, to_subaccount, fee, amount, memo, from_subaccount, created_at_time } =
    values

  const isFormValid = isValid && !isValidating

  const actorArgs = {
    to: isFormValid
      ? fromHexString(
          AccountIdentifier.fromPrincipal({
            principal: Principal.fromText(to_principal),
            subAccount: to_subaccount
              ? (SubAccount.fromBytes(new Uint8Array(JSON.parse(to_subaccount))) as SubAccount)
              : undefined,
          }).toHex()
        )
      : "",
    fee: { e8s: BigInt(fee) },
    memo: BigInt(memo),
    from_subaccount: isFormValid && from_subaccount ? [JSON.parse(from_subaccount)] : [],
    created_at_time:
      isFormValid && created_at_time ? [{ timestamp_nanos: BigInt(created_at_time) }] : [],
    amount: { e8s: BigInt(amount) },
  }

  const service = ledgerIDL({ IDL })

  const [, transferIDL] = service._fields.find(
    (el: [string]) => el[0] === CallCanisterMethod.transfer
  )

  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: LEDGER_CANISTER_ID,
          sender: user?.principal.toString() || "",
          method: CallCanisterMethod.transfer,
          arg: isFormValid ? toBase64(IDL.encode(transferIDL.argTypes, [actorArgs])) : "",
        },
      }}
      onReset={() => setValues(initialValues)}
      submitDisabled={!isFormValid}
      form={<Form values={values} errors={errors} onChange={handleChange} onBlur={handleBlur} />}
      canisterIDL={ledgerIDL}
      actorArgs={actorArgs}
      codeSnippet={`import { fromHexString } from "@dfinity/candid"
const agent = useAgent()

const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${LEDGER_CANISTER_ID}",
})

${
  to_subaccount && isFormValid
    ? `const address = AccountIdentifier.fromPrincipal({
  principal: Principal.fromText("${import.meta.env.VITE_TARGET_CANISTER}"),
  ${to_subaccount ? `subAccount: SubAccount.fromBytes(new Uint8Array(${to_subaccount}))` : ""}
}).toHex()`
    : `const address = AccountIdentifier.fromPrincipal({
  principal: Principal.fromText("${import.meta.env.VITE_TARGET_CANISTER}")}
}).toHex()`
}

const transferArgs = {
  to: fromHexString(address),
  fee: { e8s: BigInt(${actorArgs.fee.e8s}) },
  memo: BigInt(${actorArgs.memo}),
  from_subaccount: ${JSON.stringify(actorArgs.from_subaccount)},
  created_at_time: ${created_at_time ? `[{ timestamp_nanos: BigInt(${created_at_time}) }]` : "[]"},
  amount: { e8s: BigInt(${actorArgs.amount.e8s}) },
}
const response = await actor.${CallCanisterMethod.transfer}(transferArgs)`}
    />
  )
}
