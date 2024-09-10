import { actorService } from "./actor.service"
import {
  icrc21_consent_message_request,
  type _SERVICE as ConsentMessageCanister,
} from "../idl/consent"
import { idlFactory as ConsentMessageCanisterIDL } from "../idl/consent_idl"
import { Agent } from "@dfinity/agent"
import { GenericError } from "./exception-handler.service"

export const consentMessageService = {
  async getConsentMessage(
    canisterId: string,
    methodName: string,
    arg: string,
    agent: Agent
  ): Promise<string | undefined> {
    try {
      const actor = actorService.getActor<ConsentMessageCanister>(
        canisterId,
        ConsentMessageCanisterIDL,
        agent as never
      )

      const request: icrc21_consent_message_request = {
        method: methodName,
        arg: new Uint8Array(Buffer.from(arg, "base64")),
        user_preferences: {
          metadata: { language: "en", utc_offset_minutes: [] },
          device_spec: [],
        },
      }

      const consentMessageResult = await actor.icrc21_canister_call_consent_message(request)

      if ("Err" in consentMessageResult) {
        const description = Object.values(consentMessageResult.Err)[0].description
        throw new GenericError(description)
      }

      if ("LineDisplayMessage" in consentMessageResult.Ok.consent_message) {
        throw new GenericError("LineDisplayMessage is not supported")
      }

      return consentMessageResult.Ok.consent_message.GenericDisplayMessage
    } catch (error) {
      console.warn("consentMessageService getConsentMessage", error)
      return undefined
    }
  },
}
