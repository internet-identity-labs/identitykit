import { CallCanisterMethod } from "./constants"
import { Greet } from "./greet"

export function GreetWithConsent({ className }: { className?: string }) {
  return <Greet className={className} method={CallCanisterMethod.greet_with_consent} />
}
