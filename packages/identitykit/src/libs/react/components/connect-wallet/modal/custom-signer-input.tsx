import { validateUrl } from "../../../utils"
import { Button } from "../../ui/button"
import { useState } from "react"

export const CustomSignerInput = ({ onSubmit }: { onSubmit: (value: string) => unknown }) => {
  const [value, setValue] = useState("")

  const isValueValid = !value || validateUrl(value)

  return (
    <div>
      <div className="ik-text-black dark:ik-text-white ik-font-bold ik-my-[20px]">
        CustomConnect
      </div>
      <div className="ik-flex ik-items-center ik-gap-[12px] ik-relative">
        <input
          className="ik-rounded-xl ik-border ik-border-gray-400 ik-px-[10px] ik-h-[48px] ik-flex-1 ik-flex-shrink ik-text-sm ik-text-black dark:ik-text-white focus:ik-border-gray-400 dark:ik-text-white ik-outline-none"
          placeholder="https://wallet.url"
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          name="url"
        />
        <Button
          large
          disabled={!value || !isValueValid}
          className="ik-w-[110px]"
          onClick={() => onSubmit(value)}
        >
          <small>Connect</small>
        </Button>
      </div>
      {!!value && !isValueValid && (
        <p className="ik-text-xs ik-text-red-500 ik-block ik-mt-1">Invalid url</p>
      )}
    </div>
  )
}
