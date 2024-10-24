import { useAgent, useIdentityKit } from "@nfid/identitykit/react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { Actor } from "@dfinity/agent"
import { IDL } from "@dfinity/candid"
import { Button } from "../../atoms"
import { CodeSection, RequestSection, ResponseSection } from "../../molecules"
import { CALL_CANISTER_METHODS, CallCanisterMethodType } from "./constants"

type Request = {
  method: string
  params: {
    canisterId: string
    sender: string
    method: CallCanisterMethodType
    arg: string
  }
}

export function Section({
  getCodeSnippet,
  canisterIDL,
  actorArgs,
  className,
  ...props
}: {
  className?: string
  getCodeSnippet: (params: { canisterId: string; method: CallCanisterMethodType }) => string
  request: Request
  canisterIDL: IDL.InterfaceFactory
  actorArgs: unknown
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [request, setRequest] = useState<string>(JSON.stringify(props.request, null, 2))
  const [response, setResponse] = useState<string>(JSON.stringify(undefined))

  useEffect(() => {
    setRequest(JSON.stringify(props.request, null, 2))
  }, [props.request])

  const { signer, user } = useIdentityKit()
  const agent = useAgent()

  const codeSection = useMemo(() => {
    try {
      const parsedJson = JSON.parse(request) as Request
      if (!CALL_CANISTER_METHODS.includes(parsedJson.params.method))
        throw new Error("Method not supported")
      return {
        value: getCodeSnippet({
          canisterId: parsedJson.params.canisterId,
          method: parsedJson.params.method,
        }),
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
      const parsedJson = JSON.parse(request) as Request
      const actor = Actor.createActor(canisterIDL, {
        agent: agent!,
        canisterId: parsedJson.params.canisterId,
      })
      setResponse(
        JSON.stringify(
          (await actor[parsedJson.params.method](actorArgs)) as string,
          (_, value) => (typeof value === "bigint" ? value.toString() : value),
          2
        )
      )
    } catch (e) {
      if (e instanceof Error) {
        console.error(e)
        toast.error(e.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] my-[25px]">
        <RequestSection value={request} setValue={setRequest} />
        <ResponseSection value={response} />
      </div>
      <CodeSection value={codeSection.error ?? codeSection.value} />
      <div className="flex gap-5">
        <Button
          id="submit"
          loading={isLoading}
          className="w-[160px] mt-5"
          onClick={handleSubmit}
          disabled={!!codeSection.error || !agent || !user}
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
