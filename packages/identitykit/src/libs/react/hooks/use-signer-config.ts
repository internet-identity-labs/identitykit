import { useContextSelector } from "use-context-selector"
import { Context } from "../contexts"
import { ContextNotInitializedError } from "../errors"

/**
 * @returns The selected signer configuration. If signer is selected, it will return undefined.
 * @throws ContextNotInitializedError if the context is not initialized.
 */
export function useSignerConfig() {
  return useContextSelector(Context, (ctx) => {
    if (!ctx) throw new ContextNotInitializedError()
    return ctx.selectedSignerConfig
  })
}
