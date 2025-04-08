import { useAgent, useAuth } from "@nfid/identitykit/react"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Actor } from "@dfinity/agent"
import { IDL } from "@dfinity/candid"
import { Button } from "../../atoms"
import { CodeSection, RequestSection, ResponseSection } from "../../molecules"
import { CallCanisterMethodType } from "./constants"
import { ICP_API_HOST } from "../../../constants"

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
  codeSnippet,
  canisterIDL,
  actorArgs,
  className,
  form,
  submitDisabled,
  onReset,
  ...props
}: {
  className?: string
  codeSnippet: string
  request: Request
  canisterIDL: IDL.InterfaceFactory
  actorArgs: unknown
  form?: React.ReactNode
  submitDisabled?: boolean
  onReset?: () => unknown
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [request, setRequest] = useState<string>(JSON.stringify(props.request, null, 2))
  const [response, setResponse] = useState<string>(JSON.stringify(undefined))

  useEffect(() => {
    setRequest(JSON.stringify(props.request, null, 2))
  }, [props.request])

  const { user } = useAuth()

  const agent = useAgent({ host: ICP_API_HOST })

  const handleSubmit = async () => {
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
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-[25px] my-[25px]"
        id={props.request.params.method}
      >
        <RequestSection value={request} setValue={setRequest} id={"request-section"} />
        <ResponseSection id={"response-section"} value={response} />
      </div>
      {form ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-[25px]"
          id={`${props.request.params.method}_args`}
        >
          {form}
          <CodeSection value={codeSnippet} />
        </div>
      ) : (
        <CodeSection value={codeSnippet} />
      )}
      <div className="mt-[25px]">
        <Button
          id="submit"
          loading={isLoading}
          className="w-[160px] mr-5"
          onClick={handleSubmit}
          disabled={submitDisabled || !agent || !user}
        >
          Submit
        </Button>
        <Button
          color="stroke"
          className="w-[160px]"
          onClick={() => {
            onReset?.()
            setResponse(JSON.stringify(undefined))
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
