import { Method } from "../ui/atoms/method.js"
import { ISection } from "../ui/organisms/section.js"

export const basicRequest = {
  method: "icrc49_call_canister",
  params: {
    canisterId: "do25a-dyaaa-aaaak-qifua-cai",
    sender: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
    method: "greet_no_consent",
    arg: "RElETAABcQJtZQ==",
  },
}

export const withConsentMessage = {
  method: "icrc49_call_canister",
  params: {
    canisterId: "do25a-dyaaa-aaaak-qifua-cai",
    sender: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
    method: "greet",
    arg: "RElETAABcQJtZQ==",
  },
}

export const ledgerRequest = {
  method: "icrc49_call_canister",
  params: {
    canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    sender: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
    method: "transfer",
    arg: "RElETAZte2wB4KmzAnhuAGwB1vaOgAF4bgNsBvvKAQDG/LYCAbqJ5cIEeKLelOsGAoLz85EMBNijjKgNAQEFIOryWM4M9NaQ7WNXeb3wjbfURB8JbLIb5aI3/N+SxHRgECcAAAAAAAAAAAAAAAAAAAAAAOH1BQAAAAA=",
  },
}

export const icrc2approve = {
  method: "icrc49_call_canister",
  params: {
    canisterId: "etik7-oiaaa-aaaar-qagia-cai",
    sender: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
    method: "icrc2_approve",
    arg: "RElETAZufW17bgFueGwCs7DawwNorYbKgwUCbAjG/LYCALqJ5cIEAqLelOsGAoLz85EMA9ijjKgNfZGcnL8NAN6n99oNA8uW3LQOBAEFAAAAAICAgMnVm5n4jJ4EAAABHfiYTFV8824++qVOIjiov3Bgl0gU0RPMROITTCMCAA==",
  },
}

export const icrc2transfer = {
  method: "icrc49_call_canister",
  params: {
    canisterId: "etik7-oiaaa-aaaar-qagia-cai",
    sender: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
    method: "icrc2_transfer_from",
    arg: "RElETAZufW17bgFueGwCs7DawwNorYbKgwUCbAjG/LYCALqJ5cIEAqLelOsGAoLz85EMA9ijjKgNfZGcnL8NAN6n99oNA8uW3LQOBAEFAAAAAICAgMnVm5n4jJ4EAAABHfiYTFV8824++qVOIjiov3Bgl0gU0RPMROITTCMCAA==",
  },
}

export const icrc49CallCanisterSection: ISection = {
  id: "icrc49_call_canister",
  title: "4.a icrc49_call_canister",
  description: (
    <>
      This Method can be used by the relying party to request calls to 3rd party canister executed
      by the signer using the requested identity. In order to prevent misuse of this method all{" "}
      <Method>icrc49_call_canister</Method> requests are subject to user approval.
    </>
  ),
  requestsExamples: [
    {
      title: "Basic",
      value: JSON.stringify(basicRequest, null, 2),
    },
    {
      title: "With consent message",
      value: JSON.stringify(withConsentMessage, null, 2),
    },
    {
      title: "ICP transfer",
      value: JSON.stringify(ledgerRequest, null, 2),
    },
    {
      title: "ICRC-2 approve",
      value: JSON.stringify(icrc2approve, null, 2),
    },
    {
      title: "ICRC-2 transfer",
      value: JSON.stringify(icrc2transfer, null, 2),
    },
  ],
  getCodeSnippet: function (requestJSON: string): string {
    const basicRequest = JSON.parse(requestJSON)
    if (basicRequest.params?.canisterId === "ryjl3-tyaaa-aaaaa-aaaba-cai") {
      return `const { IdentityKitAgent } = useIdentityKit()

const agent = new IdentityKitAgent({
  getPrincipal: () => Principal.fromText("${basicRequest.params.sender}"),
})

const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${basicRequest.params.canisterId}",
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
const response = await actor.${basicRequest.params.method}(transferArgs)`
    }

    if (basicRequest?.params?.method === "icrc2_approve") {
      return `const { IdentityKitAgent } = useIdentityKit()

const agent = new IdentityKitAgent({
  getPrincipal: () => Principal.fromText("${basicRequest.params.sender}"),
})

const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${basicRequest.params.canisterId}",
})
  
const acc = {
  owner: Principal.fromText(
    "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe"
  ),
  subaccount: [],
}

const icrc2_approve_args = {
  from_subaccount: [],
  spender: myAcc,
  fee: [],
  memo: [],
  amount: BigInt(5000 * 10 ** 18),
  created_at_time: [],
  expected_allowance: [],
  expires_at: [],
}
  
const response = await actor.${basicRequest.params.method}(icrc2_approve_args)`
    }

    return `const { IdentityKitAgent } = useIdentityKit()
const agent = new IdentityKitAgent({
  getPrincipal: () => Principal.fromText("${basicRequest.params.sender}"),
})
const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${basicRequest.params.canisterId}",
})
const response = await actor.${basicRequest.params.method}("me")`
  },
}
