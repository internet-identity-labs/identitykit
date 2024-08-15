import { RequestSection } from "../molecules/request-section"
import { ResponseSection } from "../molecules/response-section"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { isValidJSON } from "../../utils/json"
import { Button } from "../atoms/button"
import { CodeSection } from "../molecules/code-section"
import { useIdentityKit } from "@nfid/identitykit/react"
import { Actor } from "@dfinity/agent"
import { getRequestObject } from "../../utils/requests"
import { DropdownSelect } from "../molecules/dropdown-select"

import "react-toastify/dist/ReactToastify.css"
import { idlFactory as demoIDL } from "../../idl/service_idl"
import { idlFactory as ledgerIDL } from "../../idl/ledger"
import { AccountIdentifier } from "@dfinity/ledger-icp"
import { fromHexString } from "ictool"
import { Principal } from "@dfinity/principal"

import Blur from "react-css-blur"

export interface IRequestExample {
  title: string
  value: string
}

export interface ISection {
  id: string
  title: string
  description: JSX.Element
  requestsExamples: IRequestExample[]
  getCodeSnippet: (requestJSON: string) => string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const canistersIDLs: { [key: string]: any } = {
  "ryjl3-tyaaa-aaaaa-aaaba-cai": ledgerIDL,
  "do25a-dyaaa-aaaak-qifua-cai": demoIDL,
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
  const [icrc49ActorResponse, setIcrc49ActorResponse] = useState<string | undefined>(undefined)

  const { selectedSigner, savedSigner, signerClient, agent } = useIdentityKit()

  useEffect(() => {
    if (signerClient?.connectedUser?.owner) {
      if (isValidJSON(requestValue)) {
        const rVal = JSON.parse(requestValue)
        if (rVal.params.sender) rVal.params.sender = signerClient?.connectedUser?.owner
        setRequestValue(
          JSON.stringify(
            rVal,
            (_, value) => (typeof value === "bigint" ? value.toString() : value),
            2
          )
        )
      }
    }
  }, [signerClient?.connectedUser?.owner, requestValue])

  const signer = selectedSigner ?? savedSigner

  const handleSubmit = async () => {
    if (!signer) return
    setIsLoading(true)

    if (!isValidJSON(requestValue)) {
      setIsLoading(false)
      return toast.error("Invalid JSON")
    }

    const requestObject = getRequestObject(requestValue)

    try {
      if (requestObject.method === "icrc49_call_canister") {
        setIcrc49ActorResponse(undefined)
        const { canisterId } = requestObject.params
        const actor = Actor.createActor(canistersIDLs[canisterId], {
          agent,
          canisterId,
        })

        if (
          requestObject.params?.canisterId === "ryjl3-tyaaa-aaaaa-aaaba-cai" &&
          requestObject.params?.method === "transfer"
        ) {
          const address = AccountIdentifier.fromPrincipal({
            principal: Principal.fromText("do25a-dyaaa-aaaak-qifua-cai"),
          }).toHex()

          const transferArgs = {
            to: fromHexString(address),
            fee: { e8s: BigInt(10000) },
            memo: BigInt(0),
            from_subaccount: [],
            created_at_time: [],
            amount: { e8s: BigInt(1000) },
          }
          setIcrc49ActorResponse((await actor[requestObject.params.method](transferArgs)) as string)
        } else {
          setIcrc49ActorResponse((await actor[requestObject.params.method]("me")) as string)
        }
      }
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
        icrc49ActorResponse,
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
        2
      )
    )
  }, [icrc49ActorResponse])

  const codeSection = useMemo(() => {
    if (!isValidJSON(requestValue)) return "Invalid JSON"
    return getCodeSnippet(requestValue)
  }, [getCodeSnippet, requestValue])

  const requestsOptions = useMemo(() => {
    return requestsExamples.map((r) => ({
      label: r.title,
      value: r.value,
    }))
  }, [requestsExamples])

  return (
    <Blur radius={!signerClient?.connectedUser ? "5px" : "0"} transition="400ms">
      <div id={id}>
        <small className="block mb-5">{description}</small>
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
        <div className="grid grid-cols-2 gap-[30px] my-3">
          <RequestSection value={requestValue} setValue={setRequestValue} />
          <ResponseSection value={responseValue} />
        </div>
        <CodeSection value={codeSection} />
        <div className="flex gap-5">
          <Button
            id="submit"
            loading={isLoading}
            className="w-[160px] mt-5"
            onClick={handleSubmit}
            disabled={!signerClient?.connectedUser}
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
    </Blur>
  )
}
