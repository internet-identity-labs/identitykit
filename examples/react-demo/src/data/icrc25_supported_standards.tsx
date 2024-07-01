import { Method } from "../ui/atoms/method.js"
import { ISection } from "../ui/organisms/section.js"

export const basicRequest = {
  method: "icrc25_supported_standards",
}

export const icrc25SupportedStandardsSection: ISection = {
  id: "icrc25_supported_standards",
  title: "1.c icrc25_supported_standards",
  description: (
    <>
      To understand what standards are supported on a user selected signer, you will be able to call{" "}
      <Method>icrc25_supported_standards</Method> which returns the list of strings representing the
      standard references.
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
const supportedStandards = await IdentityKit.request(${JSON.stringify(basicRequest, null, 2)})`
  },
}
