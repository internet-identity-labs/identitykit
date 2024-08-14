import { Transport } from "@slide-computer/signer"
import { getPopupTransportBuilder } from "./new-tab-transport.builder"
import { TransportType } from "../../types"
import { getExtensionTransportBuilder } from "./extension-transport.builder"

export interface TransportBuilderRequest {
  transportType: TransportType
  url: string
}

export class TransportBuilder {
  private static builders: Record<TransportType, (request: TransportBuilderRequest) => Transport> =
    {
      [TransportType.NEW_TAB]: getPopupTransportBuilder,
      [TransportType.EXTENSION]: getExtensionTransportBuilder,
    }

  public static build(request: TransportBuilderRequest): Transport {
    return TransportBuilder.builders[request.transportType](request)
  }
}
