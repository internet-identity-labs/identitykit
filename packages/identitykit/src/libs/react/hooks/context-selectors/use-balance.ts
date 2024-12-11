import { useContextSelector } from "use-context-selector"
import { ContextNotInitializedError } from "../../errors"
import { Context } from "../../contexts"

export function useBalance() {
  return useContextSelector(Context, (ctx) => {
    if (!ctx) throw new ContextNotInitializedError()
    return {
      balance: ctx.icpBalance,
      fetchBalance: ctx.fetchIcpBalance,
    }
  })
}
