import { MOCKED_SIGNER_MAIN_ACCOUNT } from "../../../constants"
import { CallCanisterMethod } from "./constants"
import { Section } from "./section"

export function WithConsentMessage({ className }: { className?: string }) {
  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: "do25a-dyaaa-aaaak-qifua-cai",
          sender: MOCKED_SIGNER_MAIN_ACCOUNT,
          method: CallCanisterMethod.greet,
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
