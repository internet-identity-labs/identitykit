import { Method } from "../ui/atoms/method.js"
import { ISection } from "../ui/organisms/section.js"

const targetCanister = import.meta.env.VITE_TARGET_CANISTER

export const basicRequest = {
  method: "icrc34_delegation",
  params: {
    publicKey: "MCowBQYDK2VwAyEAbK2m/DMYZ4FOpBH5IQnH0WX+L1+it1Yko204OSSQrVA=",
    targets: [targetCanister],
    maxTimeToLive: "28800000000000",
  },
}

export const icrc34DelegationSection: ISection = {
  id: "icrc34_delegation",
  title: "3.a icrc34_delegation",
  description: (
    <>
      When a relying party wants to authenticate as a user, it uses a session key, and below{" "}
      <Method>icrc34_delegation</Method> method to obtain a delegation chain that allows the session
      key to sign for the user's identity.
    </>
  ),
  requestsExamples: [
    {
      title: "Basic",
      value: JSON.stringify(basicRequest, null, 2),
    },
  ],
  getCodeSnippet: function (requestJSON: string): string {
    const basicRequest = JSON.parse(requestJSON)

    return `await IdentityKit.init()
const delegation = await IdentityKit.request({
  "method": "${basicRequest.method}",
  "params": {
    "publicKey": "${basicRequest.params.publicKey}",
    "targets": ${JSON.stringify(basicRequest.params.targets)}, // optional
    "derivationOrigin": "https://3y5ko-7qaaa-aaaal-aaaaq-cai.icp0.io", // optional
    "maxTimeToLive": "${basicRequest.params.maxTimeToLive}" // optional
  }
})`
  },
}
