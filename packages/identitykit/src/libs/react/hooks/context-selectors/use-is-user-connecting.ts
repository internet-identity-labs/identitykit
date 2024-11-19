import { useContextSelector } from "use-context-selector"
import { Context } from "../../contexts"
import { ContextNotInitializedError } from "../../errors"

export function useIsUserConnecting() {
  return useContextSelector(Context, (ctx) => {
    if (!ctx) throw new ContextNotInitializedError()
    return ctx.isUserConnecting
  })
}
