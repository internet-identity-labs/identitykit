import { RequestSection } from "../molecules/request-section"
import { ResponseSection } from "../molecules/response-section"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { isValidJSON } from "../../utils/json"
import { Button } from "../atoms/button"
import { CodeSection } from "../molecules/code-section"
import { useIdentityKit } from "@nfid/identitykit/react"
import { Actor } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import { getRequestObject } from "../../utils/requests"
import { DropdownSelect } from "../molecules/dropdown-select"

import "react-toastify/dist/ReactToastify.css"
import { IdentityKitSignerAgent } from "@nfid/identitykit"
import { idlFactory } from "../../idl/service_idl"

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

  const { selectedSigner, savedSigner, signerClient } = useIdentityKit()

  useEffect(() => {
    if (signerClient?.connectedUser?.owner) {
      const rVal = JSON.parse(requestValue)
      rVal.params.sender = signerClient?.connectedUser?.owner
      setRequestValue(JSON.stringify(rVal, null, 2))
    }
  }, [signerClient?.connectedUser?.owner, requestValue])

  const signer = savedSigner ?? selectedSigner

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
        const { sender, canisterId } = requestObject.params
        const agent = new IdentityKitSignerAgent({
          signer: {
            ...signer,
            // custom call canister here just to save certificate and contentMap to local state
            callCanister: async (params) => {
              const permissions = await signer.permissions()
              // TODO hot fix for nfid wallet, permissions have old format
              const permission = permissions.find((x) =>
                x.scope
                  ? "icrc49_call_canister" === x.scope.method
                  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    "icrc49_call_canister" === (x as any).method
              )
              if (!permission || permission.state === "ask_on_use") {
                await signer.requestPermissions([
                  {
                    method: "icrc49_call_canister",
                  },
                ])
              }

              return signer.callCanister(params)
            },
          },
          account: Principal.fromText(sender),
        })
        const actor = Actor.createActor(idlFactory, {
          agent,
          canisterId,
        })
        setIcrc49ActorResponse((await actor[requestObject.params.method]("me")) as any)
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
    setResponseValue(JSON.stringify(icrc49ActorResponse, null, 2))
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
        <small className="mb-5 block">{description}</small>
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
