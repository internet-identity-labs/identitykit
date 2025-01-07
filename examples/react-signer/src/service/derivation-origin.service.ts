import { Principal } from "@dfinity/principal"
import { GenericError } from "./exception-handler.service"

const MAX_ALTERNATIVE_ORIGINS = 10
const ORIGIN_VALIDATION_REGEX = /^(https:\/\/([\w-]+)(?:\.raw)?\.(?:ic0\.app|icp0\.io))$/

type ValidationResult = { result: "valid" } | { result: "invalid"; message: string }

const removeTrailingSlash = (str: string) =>
  str.endsWith("/") ? str.substring(0, str.length - 1) : str

export const derivationOriginService = {
  async validate(icrc95DerivationOrigin: string, origin: string) {
    const response = await validateDerivationOrigin(origin, icrc95DerivationOrigin)

    if (response.result === "invalid") {
      throw new GenericError("Invalid derivation origin")
    }
  },
}

const validateDerivationOrigin = async (
  authRequestOrigin: string,
  derivationOrigin?: string
): Promise<ValidationResult> => {
  const sanitizedDerivationOrigin = derivationOrigin && removeTrailingSlash(derivationOrigin)
  const sanitizedAuthRequestOrigin = removeTrailingSlash(authRequestOrigin)

  if (
    sanitizedDerivationOrigin === undefined ||
    sanitizedDerivationOrigin === sanitizedAuthRequestOrigin ||
    sanitizedDerivationOrigin.includes("http://localhost:")
  ) {
    // this is the default behaviour -> no further validation necessary
    return { result: "valid" }
  }

  // check format of derivationOrigin
  const matches = ORIGIN_VALIDATION_REGEX.exec(sanitizedDerivationOrigin)
  if (matches === null) {
    return {
      result: "invalid",
      message: `derivationOrigin does not match regex "${ORIGIN_VALIDATION_REGEX.toString()}"`,
    }
  }
  try {
    const canisterId = Principal.fromText(matches[matches.length - 1]) // verifies that a valid canister id was matched

    // Regardless of whether the _origin_ (from which principals are derived) is on ic0.app or icp0.io, we always
    // query the list of alternative origins from icp0.io (official domain)
    const alternativeOriginsUrl = `https://${canisterId.toText()}.icp0.io/.well-known/ii-alternative-origins`
    const response = await fetch(
      // always fetch non-raw
      alternativeOriginsUrl,
      // fail on redirects
      {
        redirect: "error",
        headers: {
          Accept: "application/json",
        },
        // do not send cookies or other credentials
        credentials: "omit",
      }
    )

    if (response.status !== 200) {
      return {
        result: "invalid",
        message: `${derivationOrigin} failed validation for ${authRequestOrigin}`,
      }
    }

    const alternativeOriginsObj = (await response.json()) as {
      alternativeOrigins: string[]
    }
    console.log(">> ", { alternativeOriginsObj })

    // check for expected property
    if (!Array.isArray(alternativeOriginsObj?.alternativeOrigins)) {
      return {
        result: "invalid",
        message: `resource ${alternativeOriginsUrl} has invalid format: received ${alternativeOriginsObj}`,
      }
    }

    // check number of entries
    if (alternativeOriginsObj.alternativeOrigins.length > MAX_ALTERNATIVE_ORIGINS) {
      return {
        result: "invalid",
        message: `Resource ${alternativeOriginsUrl} has too many entries: To prevent misuse at most ${MAX_ALTERNATIVE_ORIGINS} alternative origins are allowed.`,
      }
    }

    // check allowed alternative origins
    if (
      !alternativeOriginsObj.alternativeOrigins
        .map(removeTrailingSlash)
        .includes(sanitizedAuthRequestOrigin)
    ) {
      return {
        result: "invalid",
        message: `"${authRequestOrigin}" is not listed in the list of allowed alternative origins. Allowed alternative origins: ${alternativeOriginsObj.alternativeOrigins}`,
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return {
      result: "invalid",
      message: `An error occurred while validating the derivationOrigin "${derivationOrigin}" for alias domain "${authRequestOrigin}": ${e?.message}`,
    }
  }

  // all checks passed --> valid
  return { result: "valid" }
}
