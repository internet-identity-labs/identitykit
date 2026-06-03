import { Section } from "./section"
import { idlFactory as demoIDL } from "../../../idl/service_idl"
import { useAuth } from "@nfid/identitykit/react"
import { CallCanisterMethodType } from "./constants"

export function Greet({
  className,
  method,
}: {
  className?: string
  method: CallCanisterMethodType
}) {
  const { user } = useAuth()

  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: import.meta.env.VITE_TARGET_CANISTER,
          sender: user?.principal.toString() || "",
          method,
          arg: "RElETAABcQJtZQ==",
        },
      }}
      canisterIDL={demoIDL}
      actorArgs={"me"}
      codeSnippet={`const agent = useAgent()
const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${import.meta.env.VITE_TARGET_CANISTER}",
})
const response = await actor.${method}("me")`}
    />
  )
}
