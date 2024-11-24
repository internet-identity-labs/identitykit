import { CallCanisterMethod } from "./constants"
import { Section } from "./section"

export function WithoutConsentMessage({ className }: { className?: string }) {
  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: "do25a-dyaaa-aaaak-qifua-cai",
          sender: "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
          method: CallCanisterMethod.greet_no_consent,
          arg: "RElETAABcQJtZQ==",
        },
      }}
      getCodeSnippet={({ canisterId, method }) => `const agent = useAgent()
const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${canisterId}",
})
const response = await actor.${method}("me")`}
    />
  )
}
