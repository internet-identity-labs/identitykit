import { useSigner } from "@nfid/identitykit/react"
import { MethodBadge } from "../atoms"
import { Section } from "./section"

export function Icrc25SupportedStandardsSection() {
  const signer = useSigner()
  return (
    <Section
      id="icrc25_supported_standards"
      title="1.c icrc25_supported_standards"
      description={
        <>
          To understand what standards are supported on a user selected signer, you will be able to
          call <MethodBadge>icrc25_supported_standards</MethodBadge> which returns the list of
          strings representing the standard references.
        </>
      }
      request={{
        method: "icrc25_supported_standards",
      }}
      getCodeSnippet={(request) => `await IdentityKit.init()
  const supportedStandards = await IdentityKit.request(${JSON.stringify(request, null, 2)})`}
      handleSubmit={() => signer!.supportedStandards()}
    />
  )
}
