import { useContextSelector } from "use-context-selector"
import { ContextNotInitializedError } from "../../errors"
import { Context } from "../../contexts"

export function useConnect() {
  return useContextSelector(Context, (ctx) => {
    if (!ctx) throw new ContextNotInitializedError()
    return ctx.connect
  })
}
