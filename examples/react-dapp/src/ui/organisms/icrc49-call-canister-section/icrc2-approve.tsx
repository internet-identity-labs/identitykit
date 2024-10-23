import { CallCanisterMethod } from "./constants"
import { Section } from "./section"

export function Icrc2Approve() {
  return (
    <Section
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: "etik7-oiaaa-aaaar-qagia-cai",
          sender: "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
          method: CallCanisterMethod.icrc2_approve,
          arg: "RElETAZufW17bgFueGwCs7DawwNorYbKgwUCbAjG/LYCALqJ5cIEAqLelOsGAoLz85EMA9ijjKgNfZGcnL8NAN6n99oNA8uW3LQOBAEFAAAAAICAgMnVm5n4jJ4EAAABHfiYTFV8824++qVOIjiov3Bgl0gU0RPMROITTCMCAA==",
        },
      }}
      getCodeSnippet={({ canisterId, method }) => `const { agent } = useIdentityKit()
  
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: "${canisterId}",
  })
    
  const acc = {
    owner: Principal.fromText(
      "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe"
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
