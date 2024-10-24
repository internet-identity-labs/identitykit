import { Section } from "./section"
import { idlFactory as ledgerIDL } from "../../../idl/ledger"
import { AccountIdentifier } from "@dfinity/ledger-icp"
import { Principal } from "@dfinity/principal"
import { fromHexString } from "@dfinity/candid"
import { useIdentityKit } from "@nfid/identitykit/react"
import { CallCanisterMethod } from "./constants"

export function Ledger({ className }: { className?: string }) {
  const { user } = useIdentityKit()

  const address = AccountIdentifier.fromPrincipal({
    principal: Principal.fromText("do25a-dyaaa-aaaak-qifua-cai"),
  }).toHex()

  const actorArgs = {
    to: fromHexString(address),
    fee: { e8s: BigInt(10000) },
    memo: BigInt(0),
    from_subaccount: [],
    created_at_time: [],
    amount: { e8s: BigInt(1000) },
  }

  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
          sender: user?.principal.toString() || "",
          method: CallCanisterMethod.transfer,
          arg: "RElETAZte2wB4KmzAnhuAGwB1vaOgAF4bgNsBvvKAQDG/LYCAbqJ5cIEeKLelOsGAoLz85EMBNijjKgNAQEFIOryWM4M9NaQ7WNXeb3wjbfURB8JbLIb5aI3/N+SxHRgECcAAAAAAAAAAAAAAAAAAAAAAOH1BQAAAAA=",
        },
      }}
      canisterIDL={ledgerIDL}
      actorArgs={actorArgs}
      getCodeSnippet={({ canisterId, method }) => {
        if (canisterId !== "ryjl3-tyaaa-aaaaa-aaaba-cai") {
          throw new Error("Only ryjl3-tyaaa-aaaaa-aaaba-cai canister supported for this method")
        }
        return `import { fromHexString } from "@dfinity/candid"
  const { agent } = useIdentityKit()
  
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: "${canisterId}",
  })
  
  const address = AccountIdentifier.fromPrincipal({
    principal: Principal.fromText("do25a-dyaaa-aaaak-qifua-cai"),
  }).toHex()
  
  const transferArgs = {
    to: fromHexString(address),
    fee: { e8s: BigInt(10000) },
    memo: BigInt(0),
    from_subaccount: [],
    created_at_time: [],
    amount: { e8s: BigInt(1000) },
  }
  const response = await actor.${method}(transferArgs)`
      }}
    />
  )
}
