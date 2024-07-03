import clsx from "clsx"
import { useCallback, useEffect, useMemo, useState } from "react"

import { DropdownOption } from "./option"

import useClickOutside from "../../../hooks/use-click-outside"
import { IOption } from "../../../types/selectors"
import { IconSvgChevronDark, IconSvgChevronLight } from "../../atoms/icons"
import { useTheme } from "next-themes"

export interface IDropdownSelect {
  label?: string
  bordered?: boolean
  options: IOption[]
  selectedValues: string[]
  setSelectedValues: (value: string[]) => void
  placeholder?: string
  isMultiselect?: boolean
  firstSelected?: boolean
  disabled?: boolean
  errorText?: string
  id?: string
  showIcon?: boolean
  isBig?: boolean
}

export const DropdownSelect = ({
  label,
  options,
  bordered = true,
  selectedValues,
  setSelectedValues,
  placeholder = "All",
  isMultiselect = true,
  firstSelected = false,
  disabled = false,
  errorText,
  id,
  showIcon,
  isBig,
}: IDropdownSelect) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { theme } = useTheme()

  const ref = useClickOutside(() => setIsDropdownOpen(false))

  useEffect(() => {
    if (firstSelected && options.length) toggleCheckbox(false, options[0].value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstSelected, options])

  const toggleCheckbox = useCallback(
    (isChecked: boolean, value: string) => {
      const isChecking = !isChecked
      if (!isMultiselect) {
        setSelectedValues([value])
        return setIsDropdownOpen(false)
      }

      if (isChecking) setSelectedValues(selectedValues.concat([value]))
      else setSelectedValues(selectedValues.filter((v) => v !== value))
    },
    [isMultiselect, selectedValues, setSelectedValues]
  )

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValues[0]),
    [options, selectedValues]
  )

  return (
    <div
      className={clsx("relative w-full", disabled && "pointer-events-none cursor-default")}
      ref={ref}
    >
      <label
        className={clsx("text-xs tracking-[0.16px] leading-4 mb-1", "text-black dark:text-white")}
      >
        {label}
      </label>
      <div
        className={clsx(
          "bg-white rounded-xl h-12 px-3 py-2.5 w-full",
          "flex justify-between items-center",
          "cursor-pointer select-none",
          "active:outline active:outline-offset-1",
          "dark:text-white dark:bg-white/5",
          bordered && "border border-black dark:border-zinc-500",
          isDropdownOpen && "border !bg-teal-50 dark:!bg-teal-500/20 !border-teal-500",
          disabled && "!border-none !bg-gray-100 !text-black",
          errorText && "!border border-red-600 !ring-2 !ring-red-100",
          isBig && "!h-16"
        )}
        style={{ boxShadow: isDropdownOpen ? "0px 0px 2px #0E62FF" : "" }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        id={id}
      >
        <div className="flex items-center">
          {showIcon && selectedOption?.icon && (
            <img
              className={clsx(
                "mr-[13px] w-6 h-6 object-contain rounded-full",
                isBig && "!w-10 !h-10"
              )}
              src={
                typeof selectedOption?.icon === "string"
                  ? selectedOption?.icon
                  : selectedOption?.icon.src
              }
              alt={"icon"}
            />
          )}
          <p className={clsx("text-sm leading-5", !isMultiselect && "hidden")} id="selected_acc">
            {selectedValues?.length ? `${selectedValues.length} selected` : placeholder}
          </p>
          <div className={clsx("text-sm leading-5", isMultiselect && "hidden")}>
            <p>
              {selectedValues?.length
                ? options.find((o) => o.value === selectedValues[0])?.label
                : placeholder}
            </p>

            {selectedValues?.length ? (
              <p className="text-xs text-gray-400 dark:text-zinc-500">
                {options.find((o) => o.value === selectedValues[0])?.subLabel}
              </p>
            ) : null}
          </div>
        </div>
        {theme === "light" ? (
          <img
            src={IconSvgChevronLight}
            className={clsx(
              "transition-transform rotate-90 duration-200",
              isDropdownOpen && "!-rotate-90"
            )}
          />
        ) : (
          <img
            src={IconSvgChevronDark}
            className={clsx(
              "transition-transform rotate-90 duration-200",
              isDropdownOpen && "!-rotate-90"
            )}
          />
        )}
      </div>
      <p className={clsx("text-sm text-red-600")}>{errorText}</p>
      {isDropdownOpen && (
        <div
          className={clsx(
            "w-full bg-white rounded-xl mt-[1px] absolute z-50",
            "dark:bg-zinc-800 dark:text-white"
          )}
          style={{ boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)" }}
        >
          <div className={clsx("max-h-[30vh] overflow-auto flex flex-col")} id="dropdown-options">
            {options?.map((option) => (
              <DropdownOption
                key={option.value}
                option={option}
                isChecked={selectedValues.includes(option.value)}
                toggleCheckbox={toggleCheckbox}
                isCheckbox={isMultiselect}
                isBig={isBig}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
