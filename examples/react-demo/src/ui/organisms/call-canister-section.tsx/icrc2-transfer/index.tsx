import { Section } from "../section"
import { idlFactory as pepeIDL } from "../../../../idl/token-pepe-ledger"
import { Principal } from "@dfinity/principal"
import { useAuth } from "@nfid/identitykit/react"
import { CallCanisterMethod } from "../constants"
import * as yup from "yup"
import {
  numberValidation,
  principalValidation,
  subAccountValidation,
} from "../../../../validations"
import {
  MOCKED_SIGNER_MAIN_ACCOUNT,
  MOCKED_SIGNER_SECOND_ACCOUNT,
  PEPE_LEDGER_CANISTER_ID,
} from "../../../../constants"
import { useFormik } from "formik"
import { Form, FormValues } from "./form"
import { IDL } from "@dfinity/candid"
import { toBase64 } from "@nfid/identitykit"

const schema = yup
  .object({
    canister_id: principalValidation().required("field is required"),
    from_principal: principalValidation().required("field is required"),
    from_subaccount: subAccountValidation(),
    to_principal: principalValidation().required("field is required"),
    to_subaccount: subAccountValidation(),
    spender_subaccount: subAccountValidation(),
    amount: numberValidation().required("field is required"),
    memo: numberValidation(),
    created_at_time: numberValidation(),
    fee: numberValidation(),
  })
  .required()

const initialValues = {
  canister_id: PEPE_LEDGER_CANISTER_ID,
  from_principal: MOCKED_SIGNER_MAIN_ACCOUNT,
  from_subaccount: "",
  to_principal: MOCKED_SIGNER_SECOND_ACCOUNT,
  to_subaccount: "",
  spender_subaccount: "",
  amount: (1e21).toString(), // 1000 PEPE tokens
  fee: "",
  memo: "",
  created_at_time: "",
}

export function Icrc2Transfer({ className }: { className?: string }) {
  const { user } = useAuth()

  const { values, errors, isValid, isValidating, handleChange, handleBlur, setValues } =
    useFormik<FormValues>({
      initialValues,
      validationSchema: schema,
      onSubmit: () => {},
    })

  const {
    from_principal,
    from_subaccount,
    to_principal,
    to_subaccount,
    amount,
    memo,
    spender_subaccount,
    fee,
    created_at_time,
    canister_id,
  } = values

  const isFormValid = isValid && !isValidating

  const actorArgs = {
    from: {
      owner: isFormValid ? Principal.fromText(from_principal) : "",
      subaccount: isFormValid && from_subaccount ? [JSON.parse(from_subaccount)] : [],
    },
    to: {
      owner: isFormValid ? Principal.fromText(to_principal) : "",
      subaccount: isFormValid && to_subaccount ? [JSON.parse(to_subaccount)] : [],
    },
    memo: memo ? [[memo]] : [],
    fee: fee ? [fee] : [],
    spender_subaccount: isFormValid && spender_subaccount ? [JSON.parse(spender_subaccount)] : [],
    created_at_time: isFormValid && created_at_time ? [BigInt(created_at_time)] : [],
    amount: Number(amount),
  }

  const service = pepeIDL({ IDL })

  const [, transferIDL] = service._fields.find(
    ([methodName]: [string]) => methodName === CallCanisterMethod.icrc2_transfer_from
  )

  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: PEPE_LEDGER_CANISTER_ID,
          sender: user?.principal.toString() || "",
          method: CallCanisterMethod.icrc2_transfer_from,
          arg: isFormValid ? toBase64(IDL.encode(transferIDL.argTypes, [actorArgs])) : "",
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
  
const myAcc = {
  owner: Principal.fromText("${actorArgs.from.owner}"),
  subaccount: ${JSON.stringify(actorArgs.from.subaccount)},
}

const toAcc = {
  owner: Principal.fromText("${actorArgs.to.owner}"),
  subaccount: ${JSON.stringify(actorArgs.to.subaccount)},
}

const icrc2_transfer_from_args = {
  spender_subaccount: ${JSON.stringify(actorArgs.spender_subaccount)},
  from: myAcc,
  to: toAcc,
  amount: BigInt(${actorArgs.amount}),
  fee: ${JSON.stringify(actorArgs.fee)},
  memo: ${JSON.stringify(actorArgs.memo)},
  created_at_time: ${created_at_time ? `[BigInt(${created_at_time})]` : "[]"},
}

const response = await actor.${CallCanisterMethod.icrc2_transfer_from}(icrc2_transfer_from_args)`}
    />
  )
}
