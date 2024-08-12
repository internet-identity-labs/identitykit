import { Transport } from "@slide-computer/signer"
import { getPopupTransportBuilder } from "./popup-transport.builder"
import { TransportType } from "../../types"
import { getIframeTransportBuilder } from "./iframe-transport.builder"
import { getExtensionTransportBuilder } from "./extension-transport.builder"

export interface TransportBuilderRequest {
  transportType: TransportType
  url: string
}

export class TransportBuilder {
  private static builders: Record<TransportType, (request: TransportBuilderRequest) => Transport> =
    {
      [TransportType.POPUP]: getPopupTransportBuilder,
      [TransportType.IFRAME]: getIframeTransportBuilder,
      [TransportType.EXTENSION]: getExtensionTransportBuilder,
    }

  public static build(request: TransportBuilderRequest): Transport {
    return TransportBuilder.builders[request.transportType](request)
  }
}
