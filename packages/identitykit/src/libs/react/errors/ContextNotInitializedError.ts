export class ContextNotInitializedError extends Error {
  constructor() {
    super("IdentityKit context not initialized")
  }
}
