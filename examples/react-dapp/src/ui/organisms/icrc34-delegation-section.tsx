import { useIdentityKit } from "@nfid/identitykit/react"
import { MethodBadge } from "../atoms"
import { Section } from "./section"
import { DelegationRequest, DelegationResponse } from "@slide-computer/signer"

const targetCanister = import.meta.env.VITE_TARGET_CANISTER

export function Icrc34DelegationSection() {
  const { signer } = useIdentityKit()
  return (
    <Section<Omit<DelegationRequest, "jsonrpc">>
      id="icrc34_delegation"
      title="3.a icrc34_delegation"
      description={
        <>
          When a relying party wants to authenticate as a user, it uses a session key, and below{" "}
          <MethodBadge>icrc34_delegation</MethodBadge> method to obtain a delegation chain that
          allows the session key to sign for the user's identity.
        </>
      }
      request={{
        method: "icrc34_delegation",
        params: {
          publicKey: "MCowBQYDK2VwAyEAbK2m/DMYZ4FOpBH5IQnH0WX+L1+it1Yko204OSSQrVA=",
          targets: [targetCanister],
          maxTimeToLive: "28800000000000",
        },
      }}
      getCodeSnippet={(request) => `await IdentityKit.init()
const delegation = await IdentityKit.request({
  "method": "${request.method}",
  "params": {
    "publicKey": "${request.params!.publicKey}",
    "targets": ${JSON.stringify(request.params!.targets)}, // optional
    "derivationOrigin": "https://3y5ko-7qaaa-aaaal-aaaaq-cai.icp0.io", // optional
    "maxTimeToLive": "${request.params!.maxTimeToLive}" // optional
  }
})`}
      handleSubmit={async (request) => {
        const response = await signer!.sendRequest<DelegationRequest, DelegationResponse>({
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
