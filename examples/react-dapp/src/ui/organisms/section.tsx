/* eslint-disable @typescript-eslint/no-explicit-any */
import { Title } from "../atoms/title"
import { RequestSection } from "../molecules/request-section"
import { ResponseSection } from "../molecules/response-section"
import { Text } from "../atoms/text"
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
import { Buffer } from "buffer"

import "react-toastify/dist/ReactToastify.css"
import { IdentityKitSignerAgent } from "@nfid/identitykit"
import { toBase64 } from "@slide-computer/signer"
import { idlFactory as demoIDL } from "../../idl/service_idl"
import { idlFactory as ledgerIDL } from "../../idl/ledger"
import { AccountIdentifier } from "@dfinity/ledger-icp"
import { fromHexString } from "ictool"

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

const canistersIDLs: { [key: string]: any } = {
  "ryjl3-tyaaa-aaaaa-aaaba-cai": ledgerIDL,
  "do25a-dyaaa-aaaak-qifua-cai": demoIDL,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SignerMethod: any = {
  icrc25_request_permissions: "requestPermissions",
  icrc25_permissions: "permissions",
  icrc25_supported_standards: "supportedStandards",
  icrc27_accounts: "accounts",
  icrc34_delegation: "delegation",
}

const SignerMethodParamsField: any = {
  icrc25_request_permissions: "scopes",
}

export const Section: React.FC<ISection> = ({
  id,
  title,
  description,
  requestsExamples,
  getCodeSnippet,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRequestIndex, setSelectedRequestIndex] = useState(0)
  const [requestValue, setRequestValue] = useState(requestsExamples[selectedRequestIndex].value)
  const [responseValue, setResponseValue] = useState("{}")
  const [icrc49SignerResponse, setIcrc49SignerResponse] = useState<{
    certificate: string
    contentMap: string
  } | null>(null)
  const [icrc49ActorResponse, setIcrc49ActorResponse] = useState<string | null>(null)

  const { selectedSigner } = useIdentityKit()

  const handleSubmit = async () => {
    if (!selectedSigner) return
    setIsLoading(true)

    if (!isValidJSON(requestValue)) {
      setIsLoading(false)
      return toast.error("Invalid JSON")
    }

    const requestObject = getRequestObject(requestValue)

    let res

    try {
      if (requestObject.method === "icrc49_call_canister") {
        setIcrc49SignerResponse(null)
        setIcrc49ActorResponse(null)
        const { sender, canisterId } = requestObject.params

        const agent = new IdentityKitSignerAgent({
          signer: new Proxy(selectedSigner, {
            get(target, prop) {
              return async (params: any) => {
                const response = await (target as any)[prop](params)
                setIcrc49SignerResponse({
                  certificate: toBase64(response.certificate),
                  contentMap: toBase64(response.contentMap),
                })
                return response
              }
            },
          }),
          account: Principal.fromText(sender),
        })
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
      } else if (requestObject.method === "icrc34_delegation") {
        const req = {
          id: "8932ce44-a693-4d1a-a087-8468aafe536e",
          jsonrpc: "2.0",
          ...requestObject,
        }

        res = await (selectedSigner as any)?.["sendRequest"](req)
        const json = JSON.stringify(
          res,
          (_, value) => (typeof value === "bigint" ? value.toString() : value),
          2
        )
        setResponseValue(json)
        return
      } else if (requestObject.method === "icrc27_accounts") {
        const req = {
          id: "8c417beb-e7b1-4925-94b3-c737697e51bf",
          jsonrpc: "2.0",
          ...requestObject,
        }
        res = await (selectedSigner as any)?.["sendRequest"](req)
        const json = JSON.stringify(
          res,
          (_, value) => (typeof value === "bigint" ? value.toString() : value),
          2
        )
        setResponseValue(json)
        return
      } else {
        // TODO for icrc25_request_permissions should pass params.scopes as arg and for icrc34_delegation change params to Principals
        res = await (selectedSigner as any)?.[SignerMethod[requestObject.method]](
          SignerMethodParamsField[requestObject.method]
            ? requestObject.params[SignerMethodParamsField[requestObject.method]]
            : requestObject.params
        )
        if (Array.isArray(res) && res[0].subaccount) {
          const mappedResult = res.map((x: any) => {
            return {
              owner: x.owner.toString(),
              subaccount: Buffer.from(new Uint8Array(x.subaccount)).toString("base64"),
            }
          })
          setResponseValue(
            JSON.stringify(
              mappedResult,
              (_, value) => (typeof value === "bigint" ? value.toString() : value),
              2
            )
          )
          return
        }

        setResponseValue(
          JSON.stringify(
            res,
            (_, value) => (typeof value === "bigint" ? value.toString() : value),
            2
          )
        )
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

  // when certificates, contentMap and content returned from actor are in local state we can group them in one response
  useEffect(() => {
    if (icrc49SignerResponse !== null && icrc49ActorResponse !== null) {
      const { contentMap, certificate } = icrc49SignerResponse
      setResponseValue(
        JSON.stringify(
          {
            origin: "http://localhost:3001",
            jsonrpc: "2.0",
            id: "7812362e-29b8-4099-824c-067e8a50f6f3",
            result: { contentMap, certificate },
          },
          (_, value) => (typeof value === "bigint" ? value.toString() : value),
          2
        )
      )
    }
  }, [icrc49SignerResponse, icrc49ActorResponse])

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
    <div id={id}>
      <Title>{title}</Title>
      <Text className="mb-5">{description}</Text>
      {requestsOptions.length > 1 ? (
        <DropdownSelect
          id="select-request"
          label="Request examples"
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
          disabled={!selectedSigner}
          isSmall
        >
          Submit
        </Button>
        <Button
          type="stroke"
          className="w-[160px] mt-5"
          onClick={() => {
            setRequestValue(requestsExamples[selectedRequestIndex].value)
            setResponseValue("{}")
          }}
          isSmall
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
