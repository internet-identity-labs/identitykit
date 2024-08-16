import {
  CertificateVerificationError,
  LookupResult,
  LookupResultAbsent,
  LookupResultFound,
  LookupResultUnknown,
} from "@dfinity/agent"

const isLookupResultFound = (result: LookupResult): result is LookupResultFound => {
  return (result as LookupResultFound).value !== undefined
}

const isLookupResultUnknown = (result: LookupResult): result is LookupResultUnknown => {
  return (result as LookupResultUnknown).status === "unknown"
}

const isLookupResultAbsent = (result: LookupResult): result is LookupResultAbsent => {
  return (result as LookupResultAbsent).status === "absent"
}

export const getLookupResultValue = (result: LookupResult): ArrayBuffer | undefined => {
  if (!result) {
    throw new CertificateVerificationError("Certified data couldn't be found")
  }

  if (isLookupResultUnknown(result)) {
    throw new CertificateVerificationError("Certified data is unknown")
  }

  if (isLookupResultAbsent(result)) {
    throw new CertificateVerificationError("Certified data is absent")
  }

  if (isLookupResultFound(result)) {
    if (result.value instanceof ArrayBuffer) {
      return result.value
    }
  }

  throw new CertificateVerificationError("Certified data has an unexpected format")
}
