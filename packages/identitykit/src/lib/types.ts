export type SignerConfig = {
  id: string
  providerUrl: string
  label: string
  transportType: TransportType
  icon?: string
  popupHeight?: number
  popupWidth?: number
  description?: string
}

export enum TransportType {
  POPUP,
  IFRAME,
  EXTENSION,
}
