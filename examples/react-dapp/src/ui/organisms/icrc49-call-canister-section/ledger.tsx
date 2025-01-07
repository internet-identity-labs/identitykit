import { LEDGER_CANISTER_ID, MOCKED_SIGNER_MAIN_ACCOUNT } from "../../../constants"
import { CallCanisterMethod } from "./constants"
import { Section } from "./section"

export function Ledger({ className }: { className?: string }) {
  return (
    <Section
      className={className}
      request={{
        method: "icrc49_call_canister",
        params: {
          canisterId: LEDGER_CANISTER_ID,
          sender: MOCKED_SIGNER_MAIN_ACCOUNT,
          method: CallCanisterMethod.transfer,
          arg: "RElETAZte2wB4KmzAnhuAGwB1vaOgAF4bgNsBvvKAQDG/LYCAbqJ5cIEeKLelOsGAoLz85EMBNijjKgNAQEFIOryWM4M9NaQ7WNXeb3wjbfURB8JbLIb5aI3/N+SxHRgECcAAAAAAAAAAAAAAAAAAAAAAOH1BQAAAAA=",
        },
      }}
      getCodeSnippet={({ canisterId, method }) => {
        if (canisterId !== LEDGER_CANISTER_ID) {
          throw new Error(`Only ${LEDGER_CANISTER_ID} canister supported for this method`)
        }
        return `import { fromHexString } from "@dfinity/candid"
const agent = useAgent()

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
