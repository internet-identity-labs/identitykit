/* eslint-disable @typescript-eslint/no-explicit-any */
import { Title } from "../atoms/title"
import { RequestSection } from "../molecules/request-section"
import { ResponseSection } from "../molecules/response-section"
import { Text } from "../atoms/text"
import { useMemo, useState } from "react"
import { toast } from "react-toastify"
import { isValidJSON } from "../../utils/json"
import { Button } from "../atoms/button"
import { CodeSection } from "../molecules/code-section"
import { useIdentityKit } from "@nfid/identitykit/react"
import { getRequestObject } from "../../utils/requests"
import { DropdownSelect } from "../molecules/dropdown-select"
import { Buffer } from "buffer"
import { CallCanisterRequest } from "../../data"

import "react-toastify/dist/ReactToastify.css"

export type IRequestExample = {
  title: string
  value: string
  getActorArgs?: (request: CallCanisterRequest) => object | string
}

export interface ISection {
  id: string
  title: string
  description: JSX.Element
  requestsExamples: Array<IRequestExample>
  getCodeSnippet: (requestJSON: string) => string
}

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
  const { signer } = useIdentityKit()

  const handleSubmit = async () => {
    if (!signer) return
    setIsLoading(true)

    if (!isValidJSON(requestValue)) {
      setIsLoading(false)
      return toast.error("Invalid JSON")
    }

    const requestObject: any = getRequestObject(requestValue)

    let res

    try {
      if (requestObject.method === "icrc49_call_canister") {
        if (
          !requestsExamples.find(
            (r) => requestObject.params?.method === JSON.parse(r.value).params.method
          )
        ) {
          setIsLoading(false)
          return toast.error("Method is not supported")
        }
        const req = {
          id: "8932ce44-a693-4d1a-a087-8468aafe536e",
          jsonrpc: "2.0",
          ...requestObject,
        }

        res = await (signer as any)?.["sendRequest"](req)
        const json = JSON.stringify(
          res,
          (_, value) => (typeof value === "bigint" ? value.toString() : value),
          2
        )
        setResponseValue(json)
      } else if (requestObject.method === "icrc34_delegation") {
        const req = {
          id: "8932ce44-a693-4d1a-a087-8468aafe536e",
          jsonrpc: "2.0",
          ...requestObject,
        }

        res = await (signer as any)?.["sendRequest"](req)
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
        res = await (signer as any)?.["sendRequest"](req)
        const json = JSON.stringify(
          res,
          (_, value) => (typeof value === "bigint" ? value.toString() : value),
          2
        )
        setResponseValue(json)
        return
      } else {
        // TODO for icrc25_request_permissions should pass params.scopes as arg and for icrc34_delegation change params to Principals
        res = await (signer as any)?.[SignerMethod[requestObject.method]](
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
      <CodeSection value={codeSection.error ?? codeSection.value} />
      <div className="flex gap-5">
        <Button
          id="submit"
          loading={isLoading}
          className="w-[160px] mt-5"
          onClick={handleSubmit}
          disabled={!signer || !!codeSection.error}
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
