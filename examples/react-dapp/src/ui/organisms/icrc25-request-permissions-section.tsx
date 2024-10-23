import { useIdentityKit } from "@nfid/identitykit/react"
import { Link, MethodBadge } from "../atoms"
import { Section } from "./section"
import { RequestPermissionsRequest } from "@slide-computer/signer"

export function Icrc25RequestPermissionsSection() {
  const { signer } = useIdentityKit()
  return (
    <Section<Omit<RequestPermissionsRequest, "jsonrpc">>
      id="icrc25_request_permissions"
      title="1.a icrc25_request_permissions"
      description={
        <>
          The purpose of the <MethodBadge>icrc25_request_permissions</MethodBadge> method is for the
          relying party to request <Link href="#">permission scopes</Link> to perform further
          actions. If the set of granted scopes is not empty and there was no{" "}
          <Link href="#">session</Link> before, a new session is created. Some wallets auto-approve
          permissions, resulting in no approval screen after authentication (i.e. NFID Wallet).
        </>
      }
      request={{
        method: "icrc25_request_permissions",
        params: {
          scopes: [
            {
              method: "icrc27_accounts",
            },
            {
              method: "icrc34_delegation",
            },
            {
              method: "icrc49_call_canister",
            },
          ],
        },
      }}
      getCodeSnippet={(request) => `await IdentityKit.init()
  const permissions = await IdentityKit.request(${JSON.stringify(request, undefined, 2)}`}
      handleSubmit={(request) => signer!.requestPermissions(request.params!.scopes)}
    />
  )
}
