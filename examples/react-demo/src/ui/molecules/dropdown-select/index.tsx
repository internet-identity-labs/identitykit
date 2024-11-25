import clsx from "clsx"
import { useState } from "react"

import { Option } from "./option"

import { useClickOutside } from "../../../hooks"
import { IconSvgChevronDark, IconSvgChevronLight } from "../../atoms"
import { useTheme } from "next-themes"
import { Label } from "../../atoms/label"

export interface IDropdownSelect {
  label?: string
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => unknown
  id?: string
}

export const DropdownSelect = ({ label, options, onChange, value, id }: IDropdownSelect) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { resolvedTheme } = useTheme()

  const ref = useClickOutside(() => setIsDropdownOpen(false))

  return (
    <div className="relative w-full" ref={ref}>
      <Label>{label}</Label>
      <div
        className={clsx(
          "bg-white rounded-xl h-12 px-3 py-2.5 w-full",
          "flex justify-between items-center",
          "cursor-pointer select-none",
          "active:outline active:outline-offset-1 outline-teal-500",
          "dark:text-white dark:bg-white/5",
          "border border-black dark:border-zinc-500",
          isDropdownOpen && "border !bg-teal-50 dark:!bg-teal-500/20 !border-teal-500"
        )}
        style={{ boxShadow: isDropdownOpen ? "0px 0px 2px #0E62FF" : "" }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        id={id}
      >
        <div className="text-sm leading-5">
          <p>{options.find((o) => o.value === value)?.label}</p>
        </div>
        <img
          src={resolvedTheme === "light" ? IconSvgChevronLight : IconSvgChevronDark}
          className={clsx(
            "transition-transform rotate-90 duration-200",
            isDropdownOpen && "!-rotate-90"
          )}
        />
      </div>
      {isDropdownOpen && (
        <div
          className={clsx(
            "w-full bg-white rounded-xl mt-[1px] absolute z-50",
            "dark:bg-zinc-800 dark:text-white"
          )}
          style={{ boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)" }}
        >
          <div className={clsx("max-h-[30vh] overflow-auto flex flex-col")} id="dropdown-options">
            {options?.map((option, index) => (
              <Option
                key={index}
                id={`option_${option.label.replace(/\s/g, "")}`}
                onClick={() => {
                  onChange(option.value)
                  setIsDropdownOpen(false)
                }}
              >
                {option.label}
              </Option>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
