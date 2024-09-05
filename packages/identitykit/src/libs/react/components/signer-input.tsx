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

  const submitHandler = async () => {
    if (!customSignerUrl) return
    await selectCustomSigner(customSignerUrl)
  }

  return (
    <div>
      <div className="ik-text-black dark:ik-text-white ik-font-bold ik-my-[20px]">
        CustomConnect
      </div>
      <div className="ik-flex ik-items-center ik-gap-[12px] ik-relative">
        <input
          className="ik-rounded-xl ik-border ik-border-gray-400 ik-px-[10px] ik-h-[48px] ik-flex-1 ik-flex-shrink ik-text-sm ik-text-gray-400 focus:ik-border-gray-400 dark:ik-text-white [&:has(:focus-visible)]:ik-outline-none"
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
          className="ik-w-[110px]"
          onClick={submitHandler}
        >
          Connect
        </Button>
        {errors.url && (
          <p className="ik-absolute ik-text-xs ik-text-red-500 ik-top-[100%]">
            {errors.url.message}
          </p>
        )}
      </div>
    </div>
  )
}
