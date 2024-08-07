import { useContext } from "react"
import { validateUrl } from "../utils"
import { useForm } from "react-hook-form"
import { IdentityKitContext } from "../context"
import { Button } from "../ui/button"

export const SignerInput = () => {
  const { selectCustomSigner } = useContext(IdentityKitContext)
  const {
    register,
    formState: { errors },
    watch,
  } = useForm({
    mode: "all",
    defaultValues: {
      url: "",
    },
  })

  const customSignerUrl = watch("url")

  const submitHandler = () => {
    if (!customSignerUrl) return
    selectCustomSigner(customSignerUrl)
  }

  return (
    <div>
      <div className="text-black dark:text-white font-bold my-[20px]">CustomConnect</div>
      <div className="flex items-center gap-[12px] relative">
        <input
          className="rounded-xl border border-gray-400 px-[10px] h-[48px] flex-1 flex-shrink text-sm text-gray-400 focus:border-gray-400 dark:text-white"
          placeholder="https://wallet.url"
          type="text"
          {...register("url", {
            required: true,
            validate: validateUrl,
          })}
          name="url"
        />
        <Button
          disabled={Boolean(errors.url) || !customSignerUrl}
          className="w-[110px]"
          onClick={submitHandler}
        >
          Connect
        </Button>
        {errors.url && (
          <p className="absolute text-xs text-red-500 top-[100%]">{errors.url.message}</p>
        )}
      </div>
    </div>
  )
}
