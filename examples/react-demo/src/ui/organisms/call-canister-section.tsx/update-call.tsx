import { Section } from "./section"
import { idlFactory as demoIDL } from "../../../idl/service_idl"
import { useAuth } from "@nfid/identitykit/react"
import { CallCanisterMethod } from "./constants"

export function UpdateCall({ className }: { className?: string }) {
  const { user } = useAuth()

  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: import.meta.env.VITE_TARGET_CANISTER,
          sender: user?.principal.toString() || "",
          method: CallCanisterMethod.greet_update_call,
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
const response = await actor.${CallCanisterMethod.greet_update_call}("me")`}
    />
  )
}
