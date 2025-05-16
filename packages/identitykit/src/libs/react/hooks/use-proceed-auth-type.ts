import { IdentityKitAuthType, IdentityKitCustomSignerAuthType } from "../../../lib/identity-kit"

export function useProceedAuthType({
  selectedSignerId,
  customAuthType = {},
}: {
  customAuthType: IdentityKitAuthType | Record<string, IdentityKitAuthType>
  selectedSignerId?: string
}) {
  if (!selectedSignerId) return IdentityKitAuthType.DELEGATION
  if (typeof customAuthType === "object") {
    return (
      {
        // some signers does not support icrc34_delegation, other icrc27_accounts, so custom auth types are applied
        ...IdentityKitCustomSignerAuthType,
        ...(customAuthType as Record<string, IdentityKitAuthType>),
      }[selectedSignerId] ?? IdentityKitAuthType.DELEGATION
    )
  }
  return IdentityKitCustomSignerAuthType[selectedSignerId] ?? customAuthType
}
