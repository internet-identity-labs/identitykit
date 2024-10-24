import { Section } from "./section"
import { idlFactory as pepeIDL } from "../../../idl/token-pepe-ledger"
import { Principal } from "@dfinity/principal"
import { useIdentityKit } from "@nfid/identitykit/react"
import { CallCanisterMethod } from "./constants"

export function Icrc2Approve({ className }: { className?: string }) {
  const { user } = useIdentityKit()

  const myAcc = {
    owner: Principal.fromText(
      "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe" // mocked signer main account
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
          arg: "RElETAZufW17bgFueGwCs7DawwNorYbKgwUCbAjG/LYCALqJ5cIEAqLelOsGAoLz85EMA9ijjKgNfZGcnL8NAN6n99oNA8uW3LQOBAEFAAAAAICAgMnVm5n4jJ4EAAABHfiYTFV8824++qVOIjiov3Bgl0gU0RPMROITTCMCAA==",
        },
      }}
      canisterIDL={pepeIDL}
      actorArgs={actorArgs}
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
