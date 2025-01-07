import { Section as BaseSection } from "../section"
import { CallCanisterRequest } from "@slide-computer/signer"
import { useSigner } from "@nfid/identitykit/react"
import { CALL_CANISTER_METHODS, CallCanisterMethodType } from "./constants"

type SectionRequest = Omit<CallCanisterRequest, "jsonrpc">

export function Section({
  getCodeSnippet,
  className,
  request,
}: {
  getCodeSnippet: (params: { canisterId: string; method: string }) => string
  className?: string
  request: SectionRequest
}) {
  const signer = useSigner()
  return (
    <BaseSection<SectionRequest>
      className={className}
      request={request}
      id={"icrc49_call_canister-" + request.params?.method}
      getCodeSnippet={({ params }) => {
        if (!CALL_CANISTER_METHODS.includes(params!.method as CallCanisterMethodType))
          throw new Error("Method not supported")
        return getCodeSnippet({ canisterId: params!.canisterId, method: params!.method })
      }}
      handleSubmit={async (request) => {
        const response = await signer!.sendRequest({
          ...request,
          id: "8932ce44-a693-4d1a-a087-8468aafe536e",
          jsonrpc: "2.0",
        })
        if ("error" in response) {
          throw new Error(response.error.message)
        }
        if ("result" in response) {
          return response.result
        }
      }}
    />
  )
}
