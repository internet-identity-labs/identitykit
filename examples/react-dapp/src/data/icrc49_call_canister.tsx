import { AccountIdentifier } from "@dfinity/ledger-icp"
import { Principal } from "@dfinity/principal"
import { Method } from "../ui/atoms/method.js"
import { fromHexString } from "ictool"
import { ISection } from "../ui/organisms/section.js"

export interface Request {
  method: string
  params: {
    canisterId: string
    sender: string
    method: string
    arg: string
  }
}
export interface RequestExample {
  title: string
  request: Request
  getActorArgs?: (request: Request) => object | string
  getCodeSnippet: (request: Request) => string
  validateRequest?: (request: Request) => void
}

export const basic: RequestExample = {
  title: "Basic",
  request: {
    method: "icrc49_call_canister",
    params: {
      canisterId: "do25a-dyaaa-aaaak-qifua-cai",
      sender: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
      method: "greet_no_consent",
      arg: "RElETAABcQJtZQ==",
    },
  },
  getActorArgs() {
    return "me"
  },
  getCodeSnippet(request) {
    return `const { agent } = useIdentityKit()
const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${request.params.canisterId}",
})
const response = await actor.${request.params.method}("me")`
  },
}

export const withConsentMessage: RequestExample = {
  title: "With consent message",
  request: {
    method: "icrc49_call_canister",
    params: {
      canisterId: "do25a-dyaaa-aaaak-qifua-cai",
      sender: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
      method: "greet",
      arg: "RElETAABcQJtZQ==",
    },
  },
  getActorArgs() {
    return "me"
  },
  getCodeSnippet(request) {
    return `const { agent } = useIdentityKit()
const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${request.params.canisterId}",
})
const response = await actor.${request.params.method}("me")`
  },
}

export const ledger: RequestExample = {
  title: "ICP transfer",
  request: {
    method: "icrc49_call_canister",
    params: {
      canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
      sender: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
      method: "transfer",
      arg: "RElETAZte2wB4KmzAnhuAGwB1vaOgAF4bgNsBvvKAQDG/LYCAbqJ5cIEeKLelOsGAoLz85EMBNijjKgNAQEFIOryWM4M9NaQ7WNXeb3wjbfURB8JbLIb5aI3/N+SxHRgECcAAAAAAAAAAAAAAAAAAAAAAOH1BQAAAAA=",
    },
  },
  getActorArgs() {
    const address = AccountIdentifier.fromPrincipal({
      principal: Principal.fromText("do25a-dyaaa-aaaak-qifua-cai"),
    }).toHex()

    return {
      to: fromHexString(address),
      fee: { e8s: BigInt(10000) },
      memo: BigInt(0),
      from_subaccount: [],
      created_at_time: [],
      amount: { e8s: BigInt(1000) },
    }
  },
  validateRequest(request) {
    if (request.params?.canisterId !== "ryjl3-tyaaa-aaaaa-aaaba-cai") {
      throw new Error("Only ryjl3-tyaaa-aaaaa-aaaba-cai canister supported for this method")
    }
  },
  getCodeSnippet(request) {
    return `const { agent } = useIdentityKit()

const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${request.params.canisterId}",
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
const response = await actor.${request.params.method}(transferArgs)`
  },
}

export const icrc2approve: RequestExample = {
  title: "ICRC-2 approve",
  request: {
    method: "icrc49_call_canister",
    params: {
      canisterId: "etik7-oiaaa-aaaar-qagia-cai",
      sender: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
      method: "icrc2_approve",
      arg: "RElETAZufW17bgFueGwCs7DawwNorYbKgwUCbAjG/LYCALqJ5cIEAqLelOsGAoLz85EMA9ijjKgNfZGcnL8NAN6n99oNA8uW3LQOBAEFAAAAAICAgMnVm5n4jJ4EAAABHfiYTFV8824++qVOIjiov3Bgl0gU0RPMROITTCMCAA==",
    },
  },
  getActorArgs() {
    const myAcc = {
      owner: Principal.fromText(
        "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe" // mocked signer main account
      ),
      subaccount: [],
    }

    return {
      from_subaccount: [],
      spender: myAcc,
      fee: [],
      memo: [],
      amount: BigInt(5000 * 10 ** 18),
      created_at_time: [],
      expected_allowance: [BigInt(5000 * 10 ** 18)],
      expires_at: [],
    }
  },
  getCodeSnippet(request) {
    return `const { agent } = useIdentityKit()

const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${request.params.canisterId}",
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

const response = await actor.${request.params.method}(icrc2_approve_args)`
  },
}

export const icrc2transfer: RequestExample = {
  title: "ICRC-2 transfer",
  request: {
    method: "icrc49_call_canister",
    params: {
      canisterId: "etik7-oiaaa-aaaar-qagia-cai",
      sender: "535yc-uxytb-gfk7h-tny7p-vjkoe-i4krp-3qmcl-uqfgr-cpgej-yqtjq-rqe",
      method: "icrc2_transfer_from",
      arg: "RElETAZufW17bgFueGwCs7DawwNorYbKgwUCbAjG/LYCALqJ5cIEAqLelOsGAoLz85EMA9ijjKgNfZGcnL8NAN6n99oNA8uW3LQOBAEFAAAAAICAgMnVm5n4jJ4EAAABHfiYTFV8824++qVOIjiov3Bgl0gU0RPMROITTCMCAA==",
    },
  },
  getActorArgs() {
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

    return {
      spender_subaccount: [],
      from: myAcc,
      to: toAcc,
      amount: BigInt(1000 * 10 ** 18), // 1000 PEPE tokens
      fee: [],
      memo: [],
      created_at_time: [],
    }
  },
  getCodeSnippet(request) {
    return `const { agent } = useIdentityKit()

const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: "${request.params.canisterId}",
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

const response = await actor.${request.params.method}(icrc2_transfer_from_args)`
  },
}

const icrc49 = [basic, withConsentMessage, ledger, icrc2approve, icrc2transfer]

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
  requestsExamples: icrc49.map((el) => ({
    title: el.title,
    value: JSON.stringify(el.request, null, 2),
    getActorArgs: el.getActorArgs,
  })),
  getCodeSnippet: (requestJson: string) => {
    const request = JSON.parse(requestJson)
    const requestExample = icrc49.find((r) => request.params?.method === r.request.params.method)

    if (!requestExample || request.method !== "icrc49_call_canister")
      throw new Error("Method not supported")

    requestExample.validateRequest?.(request)

    return requestExample.getCodeSnippet(request)
  },
}
