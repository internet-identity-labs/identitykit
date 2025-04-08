import { useSigner } from "../../../../../packages/identitykit/src/libs/react/hooks"
import { MethodBadge } from "../atoms"
import { Section } from "./section"

export function Icrc25PermissionsSection() {
  const signer = useSigner()
  return (
    <Section
      id="icrc25_permissions"
      title="1.b icrc25_permissions"
      description={
        <>
          The purpose of the <MethodBadge>icrc25_permissions</MethodBadge> method is for the relying
          party to query the granted permission scopes on the active session.
        </>
      }
      request={{
        method: "icrc25_permissions",
      }}
      getCodeSnippet={(request) => `await IdentityKit.init()
  const grantedPermsissions = await IdentityKit.request(${JSON.stringify(request, null, 2)})`}
      handleSubmit={() => signer!.permissions()}
    />
  )
}
