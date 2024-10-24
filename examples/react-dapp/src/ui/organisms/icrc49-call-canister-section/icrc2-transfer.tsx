import { CallCanisterMethod } from "./constants"
import { Section } from "./section"

export function Icrc2Transfer({ className }: { className?: string }) {
  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: "etik7-oiaaa-aaaar-qagia-cai",
          sender: "gohz6-e6xlo-6oe6c-tno3e-xp3gi-5h3de-eqj63-qd45w-5u3jl-lz7qb-iqe",
          method: CallCanisterMethod.icrc2_transfer_from,
          arg: "RElETAZufW17bgFueGwCs7DawwNorYbKgwUCbAjG/LYCALqJ5cIEAqLelOsGAoLz85EMA9ijjKgNfZGcnL8NAN6n99oNA8uW3LQOBAEFAAAAAICAgMnVm5n4jJ4EAAABHfiYTFV8824++qVOIjiov3Bgl0gU0RPMROITTCMCAA==",
        },
      }}
      getCodeSnippet={({ canisterId, method }) => `const { agent } = useIdentityKit()
  
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: "${canisterId}",
  })
    
  const myAcc = {
    owner: Principal.fromText("otmgz-w3jqd-eutql-bdgwo-3dvfp-q5l2p-ruzio-nc3dr-2vgbi-c5eiz-tqe"),
    subaccount: [],
  }
  
  const toAcc = {
    owner: Principal.fromText(
      "6pfju-rc52z-aihtt-ahhg6-z2bzc-ofp5r-igp5i-qy5ep-j6vob-gs3ae-nae" // mocked signer second account
    ),
    subaccount: [],
  }
  
  const icrc2_transfer_from_args = {
    spender_subaccount: [],
    from: myAcc,
    to: toAcc,
    amount: BigInt(1000 * 10 ** 18), // 1000 PEPE tokens
    fee: [],
    memo: [],
    created_at_time: []
  }
  
  const response = await actor.${method}(icrc2_transfer_from_args)`}
    />
  )
}
