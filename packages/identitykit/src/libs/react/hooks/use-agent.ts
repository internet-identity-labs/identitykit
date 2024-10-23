import { useAsyncMemo } from "use-async-memo"
import { IdentityKitContext } from "../context"
import { SignerAgent } from "@slide-computer/signer-agent"
import { HttpAgent } from "@dfinity/agent"
import { IdentityKitAgent, IdentityKitAuthType } from "../../../lib"
import { useIdentity } from "./use-identity"
import { useContext } from "react"
import { DelegationSignerClient } from "../../../lib/signer-client"

export function useAgent(
  agentOptions: Omit<Parameters<typeof HttpAgent.create>[0], "identity"> = {}
) {
  const ctx = useContext(IdentityKitContext)
  const { identity } = useIdentity()

  if (!ctx) throw new Error("Identitykit Context is null")

  const { selectedSigner, user, signerClient, authType } = ctx

  const ikAgent = useAsyncMemo(async () => {
    if (!selectedSigner || !user || !signerClient) return undefined

    const isAccountsAuth = authType === IdentityKitAuthType.ACCOUNTS
    if (!isAccountsAuth && !identity) return undefined

    const delegation = isAccountsAuth
      ? undefined
      : await (signerClient as DelegationSignerClient).getDelegation()

    const defaultAgent = await HttpAgent.create({
      identity,
      host: "https://icp-api.io/",
      ...agentOptions,
    })
    const signerAgent = await SignerAgent.create({
      signer: selectedSigner,
      account: user.principal,
      agent: defaultAgent,
    })

    return IdentityKitAgent.create({
      signerAgent,
      agent: defaultAgent,
      identity,
      delegation: delegation?.delegation,
    })
  }, [selectedSigner, signerClient, authType, identity])

  return ikAgent
}
