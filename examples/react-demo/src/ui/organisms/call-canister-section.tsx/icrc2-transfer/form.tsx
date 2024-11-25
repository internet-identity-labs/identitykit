import { Input } from "../../../atoms/input"
import { FormGroup } from "../../../atoms/form-group"
import { Label } from "../../../atoms/label"
import { FormikErrors } from "formik"
import { HTMLAttributes } from "react"

export type FormValues = {
  canister_id: string
  fee?: string
  from_principal: string
  from_subaccount?: string
  to_principal: string
  to_subaccount?: string
  spender_subaccount?: string
  memo?: string
  amount: string
  created_at_time?: string
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
      <FormGroup error={errors.from_principal}>
        <Label>from (principal)</Label>
        <Input
          name="from_principal"
          invalid={!!errors.from_principal}
          value={values.from_principal}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
      <FormGroup error={errors.from_subaccount}>
        <Label>from (subaccount)</Label>
        <Input
          name="from_subaccount"
          invalid={!!errors.from_subaccount}
          value={values.from_subaccount}
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
      <FormGroup error={errors.spender_subaccount}>
        <Label>spender_subaccount</Label>
        <Input
          name="spender_subaccount"
          invalid={!!errors.spender_subaccount}
          value={values.spender_subaccount}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
      <FormGroup error={errors.amount}>
        <Label>amount</Label>
        <Input
          name="amount"
          type="number"
          invalid={!!errors.amount}
          value={values.amount}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
      <FormGroup error={errors.fee}>
        <Label>fee</Label>
        <Input
          name="fee"
          type="number"
          invalid={!!errors.fee}
          value={values.fee}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
      <FormGroup error={errors.memo}>
        <Label>memo</Label>
        <Input
          name="memo"
          type="number"
          invalid={!!errors.memo}
          value={values.memo}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
      <FormGroup className="mb-0" error={errors.created_at_time}>
        <Label>created_at_time</Label>
        <Input
          type="number"
          name="created_at_time"
          invalid={!!errors.created_at_time}
          value={values.created_at_time}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormGroup>
    </form>
  )
}
