import { Input } from "../../../atoms/input"
import { FormGroup } from "../../../atoms/form-group"
import { Label } from "../../../atoms/label"
import { FormikErrors } from "formik"
import { HTMLAttributes } from "react"

export type FormValues = {
  to_principal: string
  to_subaccount?: string
  fee: string
  memo: string
  amount: string
  from_subaccount?: string
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
      <p className="text-slate-500 dark:text-zinc-500 font-semibold mb-1">Arguments</p>
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
