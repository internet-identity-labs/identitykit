export type SignerConfig = {
  id: string
  providerUrl: string
  label: string
  transportType: TransportType
  icon?: string
  description?: string
}

export enum TransportType {
  POPUP,
  IFRAME,
  EXTENSION,
}
