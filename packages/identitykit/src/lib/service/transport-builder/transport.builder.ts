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
} & Pick<AuthClientCreateOptions, "identity" | "keyType" | "storage">

export class TransportBuilder {
  private static builders: Record<
    TransportType,
    (request: TransportBuilderRequest) => Promise<Transport>
  > = {
    [TransportType.NEW_TAB]: ({ url, crypto, window }) =>
      getPopupTransportBuilder({
        url,
        crypto,
        window,
      }),
    [TransportType.EXTENSION]: ({ id }) => getExtensionTransportBuilder({ id }),
    [TransportType.INTERNET_IDENTITY]: ({
      maxTimeToLive,
      derivationOrigin,
      identity,
      keyType,
      storage,
      allowInternetIdentityPinAuthentication,
      url,
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
