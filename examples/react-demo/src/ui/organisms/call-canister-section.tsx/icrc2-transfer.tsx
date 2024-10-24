import { Section } from "./section"
import { idlFactory as pepeIDL } from "../../../idl/token-pepe-ledger"
import { Principal } from "@dfinity/principal"
import { useIdentityKit } from "@nfid/identitykit/react"
import { CallCanisterMethod } from "./constants"

export function Icrc2Transfer({ className }: { className?: string }) {
  const { user } = useIdentityKit()

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

  const actorArgs = {
    spender_subaccount: [],
    from: myAcc,
    to: toAcc,
    amount: BigInt(1000 * 10 ** 18), // 1000 PEPE tokens
    fee: [],
    memo: [],
    created_at_time: [],
  }

  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: "etik7-oiaaa-aaaar-qagia-cai",
          sender: user?.principal.toString() || "",
          method: CallCanisterMethod.icrc2_transfer_from,
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
