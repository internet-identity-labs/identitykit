import { RequestSection } from "../molecules/request-section"
import { ResponseSection } from "../molecules/response-section"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { isValidJSON } from "../../utils/json"
import { Button } from "../atoms/button"
import { CodeSection } from "../molecules/code-section"
import { useAgent, useIdentityKit } from "@nfid/identitykit/react"
import { Actor } from "@dfinity/agent"
import { getRequestObject } from "../../utils/requests"
import { DropdownSelect } from "../molecules/dropdown-select"
import "react-toastify/dist/ReactToastify.css"

import { idlFactory as demoIDL } from "../../idl/service_idl"
import { idlFactory as ledgerIDL } from "../../idl/ledger"
import { idlFactory as pepeIDL } from "../../idl/token-pepe-ledger"

import { RequestExample } from "../../data/icrc49_call_canister"

export interface ISection {
  id: string
  description: JSX.Element
  requestsExamples: Array<{ config: RequestExample; value: string }>
  getCodeSnippet: (requestJson: string) => string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const canistersIDLs: { [key: string]: any } = {
  "ryjl3-tyaaa-aaaaa-aaaba-cai": ledgerIDL,
  "do25a-dyaaa-aaaak-qifua-cai": demoIDL,
  "etik7-oiaaa-aaaar-qagia-cai": pepeIDL,
}

export const Section: React.FC<ISection> = ({
  id,
  description,
  requestsExamples,
  getCodeSnippet,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRequestIndex, setSelectedRequestIndex] = useState(0)
  const [requestValue, setRequestValue] = useState(requestsExamples[selectedRequestIndex].value)
  const [responseValue, setResponseValue] = useState("{}")
  const [actorResponse, setActorResponse] = useState<string | undefined>(undefined)

  const { signer, user } = useIdentityKit()
  const { signerAgent } = useAgent()

  useEffect(() => {
    if (user) {
      if (isValidJSON(requestValue)) {
        const rVal = JSON.parse(requestValue)
        if (rVal.params.sender) rVal.params.sender = user.principal.toString()
        setRequestValue(JSON.stringify(rVal, null, 2))
      }
    }
  }, [user, requestValue])

  const handleSubmit = async () => {
    if (!signer) return

    setIsLoading(true)

    const requestObject = getRequestObject(requestValue)

    try {
      const args =
        requestsExamples[selectedRequestIndex].config.getActorArgs?.(requestObject) ?? requestObject

      setActorResponse(undefined)
      const { canisterId } = requestObject.params
      const actor = Actor.createActor(canistersIDLs[canisterId], {
        agent: signerAgent!,
        canisterId,
      })
      setActorResponse((await actor[requestObject.params.method](args)) as string)
    } catch (e) {
      if (e instanceof Error) {
        console.error(e)
        toast.error(e.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setResponseValue(
      JSON.stringify(
        actorResponse,
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
        2
      )
    )
  }, [actorResponse])

  const codeSection = useMemo(() => {
    if (!isValidJSON(requestValue)) return { error: "Invalid JSON" }
    try {
      return {
        value: getCodeSnippet(requestValue),
      }
    } catch (e) {
      return {
        error: (e as Error).message,
      }
    }
  }, [getCodeSnippet, requestValue])

  const requestsOptions = useMemo(() => {
    return requestsExamples.map((r) => ({
      label: r.config.title,
      value: r.value,
    }))
  }, [requestsExamples])

  return (
    <div
      style={
        !user || !signerAgent
          ? {
              filter: "blur(5px)",
              pointerEvents: "none",
            }
          : undefined
      }
      id={id}
    >
      <p className="block text-sm my-[25px]">{description}</p>
      {requestsOptions.length > 1 ? (
        <DropdownSelect
          id="select-request"
          isMultiselect={false}
          options={requestsOptions}
          selectedValues={[requestsOptions[selectedRequestIndex].value]}
          setSelectedValues={(values) => {
            setSelectedRequestIndex(requestsOptions.findIndex((o) => o.value === values[0]))
            setRequestValue(values[0])
          }}
        />
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] my-[25px]">
        <RequestSection value={requestValue} setValue={setRequestValue} />
        <ResponseSection value={responseValue} />
      </div>
      <CodeSection value={codeSection.error ?? codeSection.value} />
      <div className="flex gap-5">
        <Button
          id="submit"
          loading={isLoading}
          className="w-[160px] mt-5"
          onClick={handleSubmit}
          disabled={!!codeSection.error || !signerAgent || !user}
          isSmall
        >
          Submit
        </Button>
        <Button
          type="stroke"
          className="w-[160px] mt-5"
          onClick={() => {
            setRequestValue(requestsExamples[selectedRequestIndex].value)
            setResponseValue(JSON.stringify(undefined))
          }}
          isSmall
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
