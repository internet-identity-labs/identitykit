/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignerAgent } from "@slide-computer/signer-agent"
import {
  Certificate,
  Cbor,
  requestIdOf,
  SubmitRequestType,
  compare,
  IC_ROOT_KEY,
  lookupResultToBuffer,
} from "@dfinity/agent"
import { Expiry } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

const ROOT_KEY = new Uint8Array(
  IC_ROOT_KEY.match(/[\da-f]{2}/gi)!.map((h: string) => parseInt(h, 16))
).buffer

function decodeCallRequest(contentMap: ArrayBuffer) {
  const decoded = Cbor.decode<any>(contentMap)
  const expiry = new Expiry(0)
  ;(expiry as any)._value = BigInt(decoded.ingress_expiry.toString(10))
  return {
    ...decoded,
    canister_id: Principal.from(decoded.canister_id),
    ingress_expiry: expiry,
  }
}

const originalCall = (SignerAgent.prototype as any).call

;(SignerAgent.prototype as any).call = async function (canisterId: any, options: any) {
  canisterId = Principal.from(canisterId)
  const account = await (this as any).getPrincipal()

  console.log("[DEBUG] SignerAgent.call:", {
    canisterId: canisterId.toText(),
    method: options.methodName,
    account: account?.toText?.() || "unknown",
  })

  try {
    const result = await originalCall.call(this, canisterId, options)
    console.log("[DEBUG] ✅ SignerAgent.call succeeded")
    return result
  } catch (error: any) {
    console.error("[DEBUG] ❌ SignerAgent.call failed:", error.message)

    // Re-validate manually to find exact failure point
    try {
      // Get the signer response by calling signer directly
      const signer = (this as any).signer
      if (!signer) {
        console.log("[DEBUG] Cannot access signer for re-validation")
        throw error
      }

      console.log("[DEBUG] Re-calling signer.callCanister for diagnosis...")
      const response = await signer.callCanister({
        sender: account,
        canisterId,
        method: options.methodName,
        arg: options.arg,
      })

      console.log("[DEBUG] Got response:", {
        contentMapByteLength: response.contentMap?.byteLength,
        certificateByteLength: response.certificate?.byteLength,
      })

      // Step 1: decode contentMap
      const requestBody = decodeCallRequest(response.contentMap)
      console.log("[DEBUG] Step 1 - decode contentMap: ✅")

      // Step 2: validate fields
      const c1 = SubmitRequestType.Call === requestBody.request_type
      const c2 = canisterId.compareTo(requestBody.canister_id) === "eq"
      const c3 = options.methodName === requestBody.method_name
      const c4 = compare(options.arg, requestBody.arg) === 0
      const senderPrincipal = Principal.from(requestBody.sender)
      const c5 = account ? account.compareTo(senderPrincipal) === "eq" : "no account"
      console.log("[DEBUG] Step 2 - field checks:", { c1, c2, c3, c4, c5 })
      if (!c5 || c5 === "no account") {
        console.log("[DEBUG] sender details:", {
          expected: account?.toText?.(),
          got: senderPrincipal.toText(),
        })
      }
      if (!c4) {
        console.log("[DEBUG] arg details:", {
          expectedLength: options.arg?.byteLength,
          gotLength: requestBody.arg?.byteLength,
        })
      }

      // Step 3: requestId
      const rid = requestIdOf(requestBody)
      console.log(
        "[DEBUG] Step 3 - requestId:",
        Array.from(new Uint8Array(rid))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
      )

      // Step 4: certificate
      const rootKey = (this as any).rootKey ?? ROOT_KEY
      try {
        const cert = await Certificate.create({
          certificate: response.certificate,
          rootKey,
          canisterId,
          maxAgeInMinutes: 5,
        })
        console.log("[DEBUG] Step 4 - Certificate.create: ✅")

        // Step 5: lookup
        const lookup = cert.lookup(["request_status", rid, "status"])
        console.log("[DEBUG] Step 5 - lookup status:", (lookup as any).status)

        // Step 6: time
        const timeResult = cert.lookup(["time"])
        const timeBuf = lookupResultToBuffer(timeResult)
        console.log("[DEBUG] Step 6 - time lookup:", !!timeBuf)
      } catch (certErr: any) {
        console.error("[DEBUG] Step 4 - Certificate.create FAILED:", certErr.message)
      }
    } catch (diagErr: any) {
      console.error("[DEBUG] Diagnosis failed:", diagErr.message)
    }

    throw error
  }
}

console.log("[DEBUG] SignerAgent monkey-patch installed")
