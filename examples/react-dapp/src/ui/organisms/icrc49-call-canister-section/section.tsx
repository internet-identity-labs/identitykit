import { Section as BaseSection } from "../section"
import { useSigner } from "../../../../../../packages/identitykit/src/libs/react/hooks"
import { CALL_CANISTER_METHODS } from "./constants"
import type { Signer } from "@icp-sdk/signer"

type PartialSignerRequest = Omit<
  Parameters<Signer["sendRequest"]>[0],
  "jsonrpc" | "id" | "params"
> & {
  params?: Record<string, string>
}

export function Section<TRequest extends PartialSignerRequest>({
  getCodeSnippet,
  className,
  request,
}: {
  getCodeSnippet: (params: { canisterId: string; method: string }) => string
  className?: string
  request: TRequest
}) {
  const signer = useSigner()
  return (
    <BaseSection
      className={className}
      request={request}
      id={"icrc49_call_canister-" + request.params?.method}
      getCodeSnippet={({ params }) => {
        if (!CALL_CANISTER_METHODS.some((method) => method === params!.method))
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
