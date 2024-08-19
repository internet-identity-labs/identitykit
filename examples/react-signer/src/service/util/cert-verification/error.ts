export class CertificateVerificationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class CertificateTimeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}
