import { Transport } from "@icp-sdk/signer"
import { getPopupTransportBuilder } from "./new-tab-transport.builder"
import { TransportType } from "../../types"
import { getExtensionTransportBuilder } from "./extension-transport.builder"

export type TransportBuilderRequest = {
  id?: string
  transportType: TransportType
  url: string
  crypto?: Pick<Crypto, "randomUUID">
  window?: Window
  windowOpenerFeatures?: string
}

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
  }

  public static async build(request: TransportBuilderRequest): Promise<Transport> {
    return await TransportBuilder.builders[request.transportType](request)
  }
}
