import { Section } from "../section"
import { idlFactory as icrc7IDL } from "../../../../idl/icrc7"
import { Principal } from "@icp-sdk/core/principal"
import { useAuth } from "@nfid/identitykit/react"
import { CallCanisterMethod } from "../constants"
import * as yup from "yup"
import { IDL } from "@icp-sdk/core/candid"
import {
  principalValidation,
  subAccountValidation,
  numberValidation,
  memoValidation,
} from "../../../../validations"
import { useFormik } from "formik"
import { Form, FormValues } from "./form"
import { ICRC7_COLLECTION_CANISTER_ID, ICRC1_ORACLE_CANISTER_ID } from "../../../../constants"
import { uint8ArrayToBase64 } from "@dfinity/utils"
import { textToBytes } from "../../../../utils"

const schema = yup
  .object({
    canister_id: principalValidation().required("field is required"),
    token_id: numberValidation().required("field is required"),
    spender_principal: principalValidation().required("field is required"),
    spender_subaccount: subAccountValidation(),
    from_subaccount: subAccountValidation(),
    memo: memoValidation(),
    expires_at: numberValidation(),
  })
  .required()

const initialValues: FormValues = {
  canister_id: ICRC7_COLLECTION_CANISTER_ID,
  token_id: "1",
  spender_principal: ICRC1_ORACLE_CANISTER_ID,
  spender_subaccount: "",
  from_subaccount: "",
  memo: "",
  expires_at: "",
}

export function Icrc7Approve({ className }: { className?: string }) {
  const { user } = useAuth()

  const { values, errors, isValid, isValidating, handleChange, handleBlur, setValues } =
    useFormik<FormValues>({
      initialValues,
      validationSchema: schema,
      onSubmit: () => {},
    })

  const {
    canister_id,
    token_id,
    spender_principal,
    spender_subaccount,
    from_subaccount,
    memo,
    expires_at,
  } = values

  const isFormValid = isValid && !isValidating

  // created_at_time is required (Nat64) — set to 5 seconds ago in nanoseconds
  const createdAtTimeNs = BigInt(Date.now()) * BigInt(1_000_000) - BigInt(5_000_000_000)

  const approveTokenArg = {
    token_id: isFormValid ? BigInt(token_id) : BigInt(0),
    approval_info: {
      memo: isFormValid && memo ? [textToBytes(memo)] : [],
      from_subaccount: isFormValid && from_subaccount ? [JSON.parse(from_subaccount)] : [],
      created_at_time: createdAtTimeNs,
      expires_at: isFormValid && expires_at ? [BigInt(expires_at)] : [],
      spender: {
        owner: isFormValid ? Principal.fromText(spender_principal) : Principal.fromText("aaaaa-aa"),
        subaccount: isFormValid && spender_subaccount ? [JSON.parse(spender_subaccount)] : [],
      },
    },
  }

  // actorArgs is a vector — the method signature is icrc37_approve_tokens(vec ApproveTokenArg)
  const actorArgs = [approveTokenArg]

  const service = icrc7IDL({ IDL })
  const [, approveIDL] = service._fields.find(
    ([methodName]: [string]) => methodName === CallCanisterMethod.icrc7_approve
  )

  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: canister_id,
          sender: user?.principal.toString() || "",
          method: CallCanisterMethod.icrc7_approve,
          arg: isFormValid ? uint8ArrayToBase64(IDL.encode(approveIDL.argTypes, [actorArgs])) : "",
        },
      }}
      onReset={() => setValues(initialValues)}
      submitDisabled={!isFormValid}
      form={<Form values={values} errors={errors} onChange={handleChange} onBlur={handleBlur} />}
      canisterIDL={icrc7IDL}
      actorArgs={actorArgs}
      codeSnippet={`const agent = useAgent()

const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${canister_id}",
})

const approveArgs = [{
  token_id: BigInt(${token_id}),
  approval_info: {
    memo: ${isFormValid && memo ? `[textToBytes("${memo}")]` : "[]"},
    from_subaccount: ${isFormValid && from_subaccount ? `[${from_subaccount}]` : "[]"},
    created_at_time: BigInt(Date.now()) * BigInt(1_000_000) - BigInt(5_000_000_000),
    expires_at: ${isFormValid && expires_at ? `[BigInt(${expires_at})]` : "[]"},
    spender: {
      owner: Principal.fromText("${spender_principal}"),
      subaccount: ${isFormValid && spender_subaccount ? `[${spender_subaccount}]` : "[]"},
    },
  },
}]

const response = await actor.${CallCanisterMethod.icrc7_approve}(approveArgs)`}
    />
  )
}
