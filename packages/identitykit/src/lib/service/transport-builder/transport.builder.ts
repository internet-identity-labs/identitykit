import { Transport } from "@slide-computer/signer"
import { getPopupTransportBuilder } from "./new-tab-transport.builder"
import { TransportType } from "../../types"
import { getExtensionTransportBuilder } from "./extension-transport.builder"
import { getAuthClientTransportBuilder } from "./auth-client-transport.builder"

export interface TransportBuilderRequest {
  id?: string
  transportType: TransportType
  url: string
  crypto?: Pick<Crypto, "getRandomValues" | "randomUUID">
}

export class TransportBuilder {
  private static builders: Record<
    TransportType,
    (request: TransportBuilderRequest) => Promise<Transport>
  > = {
    [TransportType.NEW_TAB]: getPopupTransportBuilder,
    [TransportType.EXTENSION]: getExtensionTransportBuilder,
    [TransportType.INTERNET_IDENTITY]: getAuthClientTransportBuilder,
  }

  public static async build(request: TransportBuilderRequest): Promise<Transport> {
    return await TransportBuilder.builders[request.transportType](request)
  }
}
