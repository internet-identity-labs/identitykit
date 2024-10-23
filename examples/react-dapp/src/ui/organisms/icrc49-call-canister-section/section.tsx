import { Section as BaseSection } from "../section"
import { CallCanisterRequest } from "@slide-computer/signer"
import { useIdentityKit } from "@nfid/identitykit/react"
import { CALL_CANISTER_METHODS, CallCanisterMethodType } from "./constants"

type SectionRequest = Omit<CallCanisterRequest, "jsonrpc">

export function Section({
  getCodeSnippet,
  request,
}: {
  getCodeSnippet: (params: { canisterId: string; method: string }) => string
  request: SectionRequest
}) {
  const { signer } = useIdentityKit()
  return (
    <BaseSection<SectionRequest>
      request={request}
      id="icrc49_call_canister"
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
