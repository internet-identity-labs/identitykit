import { Section } from "../section"
import { idlFactory as pepeIDL } from "../../../../idl/token-pepe-ledger"
import { Principal } from "@dfinity/principal"
import { useAuth } from "@nfid/identitykit/react"
import { CallCanisterMethod } from "../constants"
import * as yup from "yup"
import { IDL } from "@dfinity/candid"
import {
  principalValidation,
  subAccountValidation,
  numberValidation,
} from "../../../../validations"
import { useFormik } from "formik"
import { Form, FormValues } from "./form"
import { MOCKED_SIGNER_MAIN_ACCOUNT, PEPE_LEDGER_CANISTER_ID } from "../../../../constants"
import { toBase64 } from "@nfid/identitykit"

const schema = yup
  .object({
    canister_id: principalValidation().required("field is required"),
    spender_principal: principalValidation().required("field is required"),
    spender_subaccount: subAccountValidation(),
    from_subaccount: subAccountValidation(),
    fee: numberValidation(),
    amount: numberValidation().required("field is required"),
    memo: numberValidation(),
    created_at_time: numberValidation(),
    expires_at: numberValidation(),
    expected_allowance: numberValidation(),
  })
  .required()

const initialValues = {
  canister_id: PEPE_LEDGER_CANISTER_ID,
  from_subaccount: "",
  spender_principal: MOCKED_SIGNER_MAIN_ACCOUNT,
  fee: "",
  memo: "",
  amount: (5000 * 10 ** 18).toString(),
  created_at_time: "",
  expected_allowance: "",
  expires_at: "",
}

export function Icrc2Approve({ className }: { className?: string }) {
  const { user } = useAuth()

  const { values, errors, isValid, isValidating, handleChange, handleBlur, setValues } =
    useFormik<FormValues>({
      initialValues,
      validationSchema: schema,
      onSubmit: () => {},
    })

  const {
    spender_principal,
    spender_subaccount,
    expected_allowance,
    fee,
    amount,
    memo,
    from_subaccount,
    created_at_time,
    expires_at,
    canister_id,
  } = values

  const isFormValid = isValid && !isValidating

  const actorArgs = {
    spender: {
      owner: isFormValid ? Principal.fromText(spender_principal) : "",
      subaccount: isFormValid && spender_subaccount ? [JSON.parse(spender_subaccount)] : [],
    },
    fee: fee ? [fee] : [],
    memo: memo ? [[memo]] : [],
    from_subaccount: isFormValid && from_subaccount ? [JSON.parse(from_subaccount)] : [],
    created_at_time: isFormValid && created_at_time ? [BigInt(created_at_time)] : [],
    expires_at: isFormValid && expires_at ? [BigInt(expires_at)] : [],
    amount: Number(amount),
    expected_allowance: expected_allowance ? [Number(expected_allowance)] : [],
  }

  const service = pepeIDL({ IDL })

  const [, approveIDL] = service._fields.find(
    ([methodName]: [string]) => methodName === CallCanisterMethod.icrc2_approve
  )

  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: canister_id,
          sender: user?.principal.toString() || "",
          method: CallCanisterMethod.icrc2_approve,
          arg: isFormValid ? toBase64(IDL.encode(approveIDL.argTypes, [actorArgs])) : "",
        },
      }}
      onReset={() => setValues(initialValues)}
      submitDisabled={!isFormValid}
      form={<Form values={values} errors={errors} onChange={handleChange} onBlur={handleBlur} />}
      canisterIDL={pepeIDL}
      actorArgs={actorArgs}
      codeSnippet={`const agent = useAgent()
  
const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${canister_id}",
})
  
const acc = {
  owner: Principal.fromText(
    "${actorArgs.spender.owner}"
  ),
  subaccount: ${JSON.stringify(actorArgs.spender.subaccount)},
}

const icrc2_approve_args = {
  from_subaccount: ${JSON.stringify(actorArgs.from_subaccount)},
  spender: acc,
  fee: ${JSON.stringify(actorArgs.fee)},
  memo: ${JSON.stringify(actorArgs.memo)},
  amount: BigInt(${actorArgs.amount}),
  created_at_time: ${created_at_time ? `[BigInt(${created_at_time})]` : "[]"},
  expected_allowance: ${JSON.stringify(actorArgs.expected_allowance)},
  expires_at: ${expires_at ? `[BigInt(${expires_at})]` : "[]"},
}

const response = await actor.${CallCanisterMethod.icrc2_approve}(icrc2_approve_args)`}
    />
  )
}
