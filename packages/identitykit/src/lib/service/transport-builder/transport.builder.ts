import { Transport } from "@slide-computer/signer"
import { getPopupTransportBuilder } from "./new-tab-transport.builder"
import { TransportType } from "../../types"
import { getExtensionTransportBuilder } from "./extension-transport.builder"
import { getAuthClientTransportBuilder } from "./auth-client-transport.builder"
import { getStoicTransportBuilder } from "./stoic-transport.builder"
import { DEFAULT_MAX_TIME_TO_LIVE } from "../../constants"
import { AuthClientCreateOptions } from "@dfinity/auth-client"

export type TransportBuilderRequest = {
  id?: string
  transportType: TransportType
  url: string
  maxTimeToLive?: bigint
  derivationOrigin?: string
  crypto?: Pick<Crypto, "randomUUID">
  window?: Window
  allowInternetIdentityPinAuthentication?: boolean
  windowOpenerFeatures?: string
} & Pick<AuthClientCreateOptions, "identity" | "keyType" | "storage">

export class TransportBuilder {
  private static builders: Record<
    TransportType,
    (request: TransportBuilderRequest) => Promise<Transport>
  > = {
    [TransportType.NEW_TAB]: ({ url, crypto, window, windowOpenerFeatures }) =>
      getPopupTransportBuilder({
        url,
        crypto,
        window,
        windowOpenerFeatures,
      }),
    [TransportType.EXTENSION]: ({ id }) => {
      if (!id) {
        throw Error("Id is required to find the ICRC-94 specific wallet")
      }
      return getExtensionTransportBuilder({ uuid: id })
    },
    [TransportType.INTERNET_IDENTITY]: ({
      maxTimeToLive,
      derivationOrigin,
      identity,
      keyType,
      storage,
      allowInternetIdentityPinAuthentication,
      url,
      windowOpenerFeatures,
    }) =>
      getAuthClientTransportBuilder({
        authClientCreateOptions: {
          identity,
          keyType,
          storage,
        },
        authClientLoginOptions: {
          maxTimeToLive,
          derivationOrigin,
          allowPinAuthentication: allowInternetIdentityPinAuthentication,
          identityProvider: url,
          windowOpenerFeatures,
        },
      }),
    [TransportType.STOIC]: ({ maxTimeToLive }) => getStoicTransportBuilder({ maxTimeToLive }),
  }

  public static async build(request: TransportBuilderRequest): Promise<Transport> {
    return await TransportBuilder.builders[request.transportType]({
      ...request,
      maxTimeToLive: request.maxTimeToLive || DEFAULT_MAX_TIME_TO_LIVE,
    })
  }
}
