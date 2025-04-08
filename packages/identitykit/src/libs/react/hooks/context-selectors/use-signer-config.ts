import { useContextSelector } from "use-context-selector"
import { ContextNotInitializedError } from "../../errors"
import { Context } from "../../contexts"
import { TransportType } from "../../../../lib/types"

export function useSignerConfig() {
  return useContextSelector(Context, (ctx) => {
    if (!ctx) throw new ContextNotInitializedError()
    return ctx.selectedSigner?.id
      ? (ctx.signers.find((s) => s.id === ctx.selectedSigner?.id) ?? {
          id: ctx.selectedSigner?.id,
          label: ctx.selectedSigner?.id,
          transportType: TransportType.NEW_TAB,
          providerUrl: ctx.selectedSigner?.id,
        })
      : undefined
  })
}
