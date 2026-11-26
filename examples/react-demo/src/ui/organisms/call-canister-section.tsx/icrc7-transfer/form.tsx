import { Input } from "../../../atoms/input"
import { FormGroup } from "../../../atoms/form-group"
import { Label } from "../../../atoms/label"
import { FormikErrors } from "formik"
import { HTMLAttributes } from "react"

export type FormValues = {
  canister_id: string
  token_ids: string
  to_principal: string
  to_subaccount?: string
  from_subaccount?: string
  memo?: string
}

export function Form({
  errors,
  values,
  onChange,
  onBlur,
}: {
  errors: FormikErrors<FormValues>
  values: FormValues
} & Pick<HTMLAttributes<HTMLInputElement>, "onChange" | "onBlur">) {
  return (
    <form>
      <p className="text-slate-500 dark:text-zinc-500 font-semibold mb-1">Canister ID</p>
      <FormGroup error={errors.canister_id}>
        <Input
          name="canister_id"
          invalid={!!errors.canister_id}
          value={values.canister_id}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
      <p className="text-slate-500 dark:text-zinc-500 font-semibold mb-1">Arguments</p>
      <FormGroup error={errors.token_ids}>
        <Label>token_ids (e.g. "9" or "9, 10")</Label>
        <Input
          name="token_ids"
          inputMode="text"
          invalid={!!errors.token_ids}
          value={values.token_ids}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
      <FormGroup error={errors.to_principal}>
        <Label>to (principal)</Label>
        <Input
          name="to_principal"
          invalid={!!errors.to_principal}
          value={values.to_principal}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
      <FormGroup error={errors.to_subaccount}>
        <Label>to (subaccount)</Label>
        <Input
          name="to_subaccount"
          invalid={!!errors.to_subaccount}
          value={values.to_subaccount}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
      <FormGroup error={errors.from_subaccount}>
        <Label>from_subaccount</Label>
        <Input
          name="from_subaccount"
          invalid={!!errors.from_subaccount}
          value={values.from_subaccount}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
      <FormGroup className="mb-0" error={errors.memo}>
        <Label>memo</Label>
        <Input
          name="memo"
          invalid={!!errors.memo}
          value={values.memo}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
    </form>
  )
}
