import { useAsyncMemo } from "use-async-memo"
import { IdentityKitContext } from "../context"
import { SignerAgent } from "@slide-computer/signer-agent"
import { IdentityKitAgent, IdentityKitAuthType } from "../../../lib"
import { useIdentity } from "./useIdentity"
import { useContext } from "react"
import { DelegationSignerClient } from "../../../lib/signer-client"

export function useAgent() {
  const ctx = useContext(IdentityKitContext)
  const { identity } = useIdentity()

  if (!ctx) throw new Error("Identitykit Context is null")

  const { selectedSigner, user, agent, signerClient, authType } = ctx

  const agents = useAsyncMemo(async () => {
    if (!selectedSigner || !user || !signerClient) return undefined
    const delegation =
      authType === IdentityKitAuthType.ACCOUNTS
        ? undefined
        : await (signerClient as DelegationSignerClient).getDelegation()
    const signerAgent = await SignerAgent.create({
      signer: selectedSigner,
      account: user.principal,
    })
    return {
      signerAgent,
      identityKitAgent: await IdentityKitAgent.create({
        signerAgent,
        agent,
        identity,
        delegation: delegation?.delegation,
      }),
    }
  }, [selectedSigner, signerClient, authType])

  return {
    identityKitAgent: agents?.identityKitAgent,
    signerAgent: agents?.signerAgent,
  }
}
