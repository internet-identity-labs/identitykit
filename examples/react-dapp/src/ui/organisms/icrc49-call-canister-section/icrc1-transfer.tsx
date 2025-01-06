import {
  MOCKED_SIGNER_MAIN_ACCOUNT,
  MOCKED_SIGNER_SECOND_ACCOUNT,
  ALIEN_LEDGER_CANISTER_ID,
} from "../../../constants"
import { CallCanisterMethod } from "./constants"
import { Section } from "./section"

export function Icrc1Transfer({ className }: { className?: string }) {
  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: ALIEN_LEDGER_CANISTER_ID,
          sender: MOCKED_SIGNER_MAIN_ACCOUNT,
          method: CallCanisterMethod.icrc1_transfer,
          arg: "RElETAZte24AbAKzsNrDA2ithsqDBQFufW54bAb7ygECxvy2AgO6ieXCBAGi3pTrBgGC8/ORDATYo4yoDX0BBQEdXdZAg85gOc3s6DkTiv7FBn9RDHSPT6rgmlsBGgIAAAAAAIDIr6Al",
        },
      }}
      getCodeSnippet={({ canisterId, method }) => `const agent = useAgent()
  
const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${canisterId}",
})
  
const toAcc = {
  owner: Principal.fromText("${MOCKED_SIGNER_SECOND_ACCOUNT}"), // mocked signer second account
  subaccount: [],
}

const icrc1_transfer_args = {
  from_subaccount: [],
  to: toAcc,
  amount: BigInt(1000 * 10 ** 18), // 1000 PEPE tokens
  fee: [],
  memo: [],
  created_at_time: []
}

const response = await actor.${method}(icrc1_transfer_args)`}
    />
  )
}
