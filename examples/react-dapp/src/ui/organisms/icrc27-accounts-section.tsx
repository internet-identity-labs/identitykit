import { useSigner } from "../../../../../packages/identitykit/src/libs/react/hooks"
import { MethodBadge } from "../atoms"
import { Section } from "./section"
import { AccountsRequest, AccountsResponse } from "@slide-computer/signer"

export function Icrc27AccountsSection() {
  const signer = useSigner()
  return (
    <Section
      id="icrc27_accounts"
      title="2.a icrc27_accounts"
      description={
        <>
          The purpose of the <MethodBadge>icrc27_accounts</MethodBadge> message is for the relying
          party to receive principals and subaccounts managed by the signer.
        </>
      }
      request={{
        method: "icrc27_accounts" as const,
      }}
      getCodeSnippet={() => `await IdentityKit.init()
  const accounts = await IdentityKit.request({
    "method": "icrc27_accounts",
    "params": {
      "derivationOrigin": "https://3y5ko-7qaaa-aaaal-aaaaq-cai.icp0.io", // optional
    }
  })`}
      handleSubmit={async (request) => {
        const response = await signer!.sendRequest<AccountsRequest, AccountsResponse>({
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
