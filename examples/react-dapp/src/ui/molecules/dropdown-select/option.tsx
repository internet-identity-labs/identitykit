import clsx from "clsx"

import { Checkbox } from "../../atoms/checkbox"
import { IOption } from "../../../types/selectors"

export interface IDropdownOption {
  option: IOption
  isChecked: boolean
  toggleCheckbox: (isChecked: boolean, value: string) => void
  isCheckbox: boolean
  isBig?: boolean
}

export const DropdownOption = ({
  option,
  isChecked,
  toggleCheckbox,
  isCheckbox,
  isBig,
}: IDropdownOption) => {
  return (
    <label
      key={`option_${option.value}`}
      id={`option_${option.label.replace(/\s/g, "")}`}
      htmlFor={`option_cbx_${option.label.replace(/\s/g, "")}`}
      className={clsx(
        "py-2.5 hover:bg-gray-100 cursor-pointer px-[13px] rounded-xl",
        "flex items-center text-sm text-black",
        "dark:hover:bg-zinc-500/20",
        option.disabled && "pointer-events-none !text-gray-400 dark:!text-white",
        isBig && "h-[60px]"
      )}
    >
      <Checkbox
        value={option.value}
        isChecked={isChecked}
        onChange={toggleCheckbox}
        className={clsx("mr-[13px]", !isCheckbox && "hidden")}
        id={`option_cbx_${option.label.replace(/\s/g, "")}`}
      />
      {option.icon && (
        <img
          className={clsx(
            "mr-[13px] w-12 h-12 object-contain shrink-0 rounded-full",
            isCheckbox ? "w-10 h-12" : "w-5 h-5",
            isBig && "!w-10 !h-10"
          )}
          src={typeof option.icon === "string" ? option.icon : option.icon.src}
          alt={option.value}
        />
      )}
      <div className="flex flex-col w-full">
        <span className="w-full dark:text-white">{option.label}</span>
        {option.subLabel ? (
          <span className="text-xs text-gray-400 dark:text-zinc-500">{option.subLabel}</span>
        ) : null}
      </div>
      <span
        className="text-gray-400 dark:text-zinc-500 whitespace-nowrap"
        id={`option_txs_${option.label.replace(/\s/g, "")}`}
      >
        {option.afterLabel}
      </span>
    </label>
  )
}
