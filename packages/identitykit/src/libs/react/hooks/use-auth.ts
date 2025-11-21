import { useEffect, useRef } from "react"
import {
  useConnect,
  useDisconnect,
  useIsUserConnecting,
  useUser,
  useSignerClient,
} from "./context-selectors"
import { DelegationSignerClient } from "../../../lib/signer-client/delegation-client"

export function useAuth() {
  const user = useUser()
  const isConnecting = useIsUserConnecting()
  const connect = useConnect()
  const disconnect = useDisconnect()
  const signerClient = useSignerClient()
  const hasDetectedDesync = useRef(false)

  useEffect(() => {
    if (hasDetectedDesync.current || isConnecting) return
    const isDelegationClient = signerClient instanceof DelegationSignerClient

    if (!isDelegationClient) {
      return
    }

    const identity = signerClient.getIdentity()
    const isIdentityAnonymous = identity?.getPrincipal()?.isAnonymous()

    if (user && isIdentityAnonymous) {
      hasDetectedDesync.current = true
      disconnect().catch((error) => {
        console.error("[IdentityKit] Failed to disconnect during desync recovery:", error)
      })
    }
  }, [user, signerClient, isConnecting, disconnect])

  return {
    user,
    isConnecting,
    connect,
    disconnect,
  }
}
