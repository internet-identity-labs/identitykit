import { Section } from "../section"
import { idlFactory as icrc7IDL } from "../../../../idl/icrc7"
import { Principal } from "@icp-sdk/core/principal"
import { useAuth } from "@nfid/identitykit/react"
import { CallCanisterMethod } from "../constants"
import * as yup from "yup"
import { IDL } from "@icp-sdk/core/candid"
import { principalValidation, subAccountValidation, memoValidation } from "../../../../validations"
import { useFormik } from "formik"
import { Form, FormValues } from "./form"
import { ICRC7_COLLECTION_CANISTER_ID, MOCKED_SIGNER_MAIN_ACCOUNT } from "../../../../constants"
import { uint8ArrayToBase64 } from "@dfinity/utils"
import { textToBytes } from "../../../../utils"

const tokenIdsValidation = () =>
  yup
    .string()
    .required("field is required")
    .test("token_ids", "must be one or more whole numbers, e.g. 9 or 9, 10", (value) => {
      if (!value) return false
      try {
        const ids = value.split(",").map((s) => s.trim())
        if (ids.length === 0) return false
        return ids.every((id) => {
          const n = BigInt(id)
          IDL.encode([IDL.Nat], [n])
          return true
        })
      } catch {
        return false
      }
    })

const schema = yup
  .object({
    canister_id: principalValidation().required("field is required"),
    token_ids: tokenIdsValidation(),
    to_principal: principalValidation().required("field is required"),
    to_subaccount: subAccountValidation(),
    from_subaccount: subAccountValidation(),
    memo: memoValidation(),
  })
  .required()

const initialValues: FormValues = {
  canister_id: ICRC7_COLLECTION_CANISTER_ID,
  token_ids: "1",
  to_principal: MOCKED_SIGNER_MAIN_ACCOUNT,
  to_subaccount: "",
  from_subaccount: "",
  memo: "",
}

export function Icrc7Transfer({ className }: { className?: string }) {
  const { user } = useAuth()

  const { values, errors, isValid, isValidating, handleChange, handleBlur, setValues } =
    useFormik<FormValues>({
      initialValues,
      validationSchema: schema,
      onSubmit: () => {},
    })

  const { canister_id, token_ids, to_principal, to_subaccount, from_subaccount, memo } = values

  const isFormValid = isValid && !isValidating

  const parsedTokenIds = isFormValid
    ? token_ids
        .split(",")
        .map((s) => s.trim())
        .map(BigInt)
    : [BigInt(0)]

  const toAccount = {
    owner: isFormValid ? Principal.fromText(to_principal) : Principal.fromText("aaaaa-aa"),
    subaccount: isFormValid && to_subaccount ? [JSON.parse(to_subaccount)] : [],
  }

  const actorArgs = parsedTokenIds.map((token_id) => ({
    to: toAccount,
    token_id,
    memo: isFormValid && memo ? [textToBytes(memo)] : [],
    from_subaccount: isFormValid && from_subaccount ? [JSON.parse(from_subaccount)] : [],
    created_at_time: [],
  }))

  const service = icrc7IDL({ IDL })
  const [, transferIDL] = service._fields.find(
    ([methodName]: [string]) => methodName === CallCanisterMethod.icrc7_transfer
  )

  const tokenIdsList = isFormValid
    ? token_ids
        .split(",")
        .map((s) => s.trim())
        .join(", ")
    : token_ids

  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: canister_id,
          sender: user?.principal.toString() || "",
          method: CallCanisterMethod.icrc7_transfer,
          arg: isFormValid ? uint8ArrayToBase64(IDL.encode(transferIDL.argTypes, [actorArgs])) : "",
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

const transferArgs = [${tokenIdsList}].map((tokenId) => ({
  to: {
    owner: Principal.fromText("${to_principal}"),
    subaccount: ${isFormValid && to_subaccount ? `[${to_subaccount}]` : "[]"},
  },
  token_id: BigInt(tokenId),
  memo: ${isFormValid && memo ? `[textToBytes("${memo}")]` : "[]"},
  from_subaccount: ${isFormValid && from_subaccount ? `[${from_subaccount}]` : "[]"},
  created_at_time: [],
}))

const response = await actor.${CallCanisterMethod.icrc7_transfer}(transferArgs)`}
    />
  )
}
