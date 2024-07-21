import { Method } from "../ui/atoms/method.js"
import { ISection } from "../ui/organisms/section.js"

export const basicRequest = {
  method: "icrc27_accounts",
}

export const icrc27AccountsSection: ISection = {
  id: "icrc27_accounts",
  title: "2.a icrc27_accounts",
  description: (
    <>
      The purpose of the <Method>icrc27_accounts</Method> message is for the relying party to
      receive principals and subaccounts managed by the signer.
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
const accounts = await IdentityKit.request({
  "method": "${basicRequest.method}",
  "params": {
    "derivationOrigin": "https://3y5ko-7qaaa-aaaal-aaaaq-cai.icp0.io", // optional
  }
})`
  },
}
