import { useContextSelector } from "use-context-selector"
import { ContextNotInitializedError } from "../../errors"
import { Context } from "../../contexts"

export function useModal() {
  return useContextSelector(Context, (ctx) => {
    if (!ctx) throw new ContextNotInitializedError()
    return {
      isModalOpen: ctx.isModalOpen,
      toggleModal: ctx.toggleModal,
      featuredSigner: ctx.featuredSigner,
      signers: ctx.signers,
      selectCustomSigner: ctx.selectCustomSigner,
      selectSigner: ctx.selectSigner,
    }
  })
}
