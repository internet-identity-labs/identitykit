import { useSigner } from "../../../../../packages/identitykit/src/libs/react/hooks"
import { useMemo, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "../atoms"
import { CodeSection, RequestSection, ResponseSection } from "../molecules"
import { JsonRequest } from "@slide-computer/signer"

export function Section<TRequest extends Omit<JsonRequest, "jsonrpc">>({
  getCodeSnippet,
  title,
  className,
  description,
  id,
  ...props
}: {
  getCodeSnippet: (req: TRequest) => string
  handleSubmit: (req: TRequest) => Promise<unknown>
  className?: string
  request: TRequest
  title?: string
  description?: React.ReactNode
  id: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [request, setRequest] = useState(JSON.stringify(props.request, null, 2))
  const [response, setResponse] = useState<string>(JSON.stringify(undefined))

  const signer = useSigner()

  const codeSection = useMemo(() => {
    try {
      const parsedJson = JSON.parse(request) as TRequest
      return {
        value: getCodeSnippet(parsedJson),
      }
    } catch (e) {
      if (e instanceof SyntaxError) return { error: "Invalid JSON" }
      if (e instanceof Error) return { error: e.message }
      throw e
    }
  }, [request, getCodeSnippet])

  const handleSubmit = async () => {
    if (!signer) return

    setIsLoading(true)
    setResponse(JSON.stringify(undefined))

    try {
      const parsedJson = JSON.parse(request) as TRequest

      setResponse(
        JSON.stringify(
          await props.handleSubmit(parsedJson),
          (_, value) => (typeof value === "bigint" ? value.toString() : value),
          2
        )
      )
    } catch (e) {
      if (e instanceof Error) {
        console.error(e)
        if (e.message === "Not supported") {
          toast.error(
            `The connected signer does not support one of the methods for which permission was requested`
          )
          return
        }
        toast.error(e.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className} id={id}>
      {title && <h2 className="mb-5 text-xl font-normal">{title}</h2>}
      {description && <div className="text-sm leading-[22px]">{description}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] my-[25px]">
        <RequestSection id={"request-section-" + id} value={request} setValue={setRequest} />
        <ResponseSection id={"response-section-" + id} value={response} />
      </div>
      <CodeSection value={codeSection.error ?? codeSection.value} />
      <div className="flex gap-5">
        <Button
          id={"submit-" + id}
          loading={isLoading}
          className="w-[160px] mt-5"
          onClick={handleSubmit}
          disabled={!!codeSection.error || !signer}
        >
          Submit
        </Button>
        <Button
          color="stroke"
          className="w-[160px] mt-5"
          onClick={() => {
            setRequest(JSON.stringify(props.request))
            setResponse(JSON.stringify(undefined))
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
