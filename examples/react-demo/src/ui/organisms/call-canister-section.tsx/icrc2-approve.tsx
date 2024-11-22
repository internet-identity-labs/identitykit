import { Section } from "./section"
import { idlFactory as pepeIDL } from "../../../idl/token-pepe-ledger"
import { Principal } from "@dfinity/principal"
import { useAuth } from "@nfid/identitykit/react"
import { CallCanisterMethod } from "./constants"

export function Icrc2Approve({ className }: { className?: string }) {
  const { user } = useAuth()

  const myAcc = {
    owner: Principal.fromText(
      "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe" // mocked signer main account
    ),
    subaccount: [],
  }

  const actorArgs = {
    from_subaccount: [],
    spender: myAcc,
    fee: [],
    memo: [],
    amount: BigInt(5000 * 10 ** 18),
    created_at_time: [],
    expected_allowance: [],
    expires_at: [],
  }

  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: "etik7-oiaaa-aaaar-qagia-cai",
          sender: user?.principal.toString() || "",
          method: CallCanisterMethod.icrc2_approve,
          arg: "RElETAZufW17bgFueGwCs7DawwNorYbKgwUCbAjG/LYCALqJ5cIEAqLelOsGAoLz85EMA9ijjKgNfZGcnL8NAN6n99oNA8uW3LQOBAEFAAAAAICAgMnVm5n4jJ4EAAABHddbvOJ4U2u2S79mR0+xkJBPtwHztu02la8/gFECAA==",
        },
      }}
      canisterIDL={pepeIDL}
      actorArgs={actorArgs}
      getCodeSnippet={({ canisterId, method }) => `const agent = useAgent()
  
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: "${canisterId}",
  })
    
  const acc = {
    owner: Principal.fromText(
      "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe" // mocked signer main account
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
