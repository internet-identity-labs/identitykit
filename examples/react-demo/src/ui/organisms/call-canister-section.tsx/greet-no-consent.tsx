import { CallCanisterMethod } from "./constants"
import { Greet } from "./greet"

export function GreetNoConsent({ className }: { className?: string }) {
  return <Greet className={className} method={CallCanisterMethod.greet_no_consent} />
}
