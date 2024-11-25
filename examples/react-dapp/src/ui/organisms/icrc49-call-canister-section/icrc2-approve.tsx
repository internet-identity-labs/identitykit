import {
  MOCKED_SIGNER_MAIN_ACCOUNT,
  MOCKED_SIGNER_SECOND_ACCOUNT,
  PEPE_LEDGER_CANISTER_ID,
} from "../../../constants"
import { CallCanisterMethod } from "./constants"
import { Section } from "./section"

export function Icrc2Approve({ className }: { className?: string }) {
  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: PEPE_LEDGER_CANISTER_ID,
          sender: MOCKED_SIGNER_SECOND_ACCOUNT,
          method: CallCanisterMethod.icrc2_approve,
          arg: "RElETAZufW17bgFueGwCs7DawwNorYbKgwUCbAjG/LYCALqJ5cIEAqLelOsGAoLz85EMA9ijjKgNfZGcnL8NAN6n99oNA8uW3LQOBAEFAAAAAICAgMnVm5n4jJ4EAAABHddbvOJ4U2u2S79mR0+xkJBPtwHztu02la8/gFECAA==",
        },
      }}
      getCodeSnippet={({ canisterId, method }) => `const agent = useAgent()
  
const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${canisterId}",
})
  
const acc = {
  owner: Principal.fromText(
    "${MOCKED_SIGNER_MAIN_ACCOUNT}" // mocked signer main account
  ),
  subaccount: [],
}

const icrc2_approve_args = {
  from_subaccount: [],
  spender: acc,
  fee: [],
  memo: [],
  amount: BigInt(5000 * 10 ** 18),
  created_at_time: [],
  expected_allowance: [],
  expires_at: [],
}

const response = await actor.${method}(icrc2_approve_args)`}
    />
  )
}
