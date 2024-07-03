import clsx from "clsx"
import { Label } from "./label"

export interface ICheckbox {
  value: string
  isChecked: boolean
  onChange: (isChecked: boolean, value: string) => void
  className?: string
  labelText?: string
  labelClassName?: string
  id?: string
}

export const Checkbox = ({
  value,
  isChecked,
  onChange,
  className,
  labelText,
  labelClassName,
  id,
}: ICheckbox) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        id={id}
        className={clsx("rounded-[3px] h-[18px] w-[18px] border border-black", className)}
        type="checkbox"
        checked={isChecked}
        onChange={() => onChange(isChecked, value)}
      />
      {labelText && (
        <Label
          id="checkbox_label"
          className={clsx("cursor-pointer", labelClassName)}
          htmlFor={value}
        >
          {labelText}
        </Label>
      )}
    </div>
  )
}
