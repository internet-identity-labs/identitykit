import { useCallback, useEffect, useState } from "react"
import {
  IdentityKitAuthType,
  IdentityKit,
  IdentityKitAccountsSignerClientOptions,
  IdentityKitDelegationSignerClientOptions,
  IdentityKitSignerAgentOptions,
} from "../../../lib"
import { Signer } from "@slide-computer/signer"
import { Principal } from "@dfinity/principal"
import { SignerAgent } from "@slide-computer/signer-agent"

const DEFAULT_IDLE_TIMEOUT = 14_400_000

export function useCreateIdentityKit<
  T extends IdentityKitAuthType = typeof IdentityKitAuthType.ACCOUNTS,
>({
  selectedSigner,
  clearSigner,
  signerClientOptions = {},
  authType,
  agentOptions,
  onConnectFailure,
  onConnectSuccess,
  onDisconnect,
  realConnectDisabled,
}: {
  selectedSigner?: Signer
  clearSigner: () => Promise<unknown>
  authType?: T
  signerClientOptions?: T extends typeof IdentityKitAuthType.DELEGATION
    ? Omit<IdentityKitDelegationSignerClientOptions, "signer">
    : Omit<IdentityKitAccountsSignerClientOptions, "signer">
  agentOptions?: {
    agent?: IdentityKitSignerAgentOptions<Signer>["agent"]
  }
  onConnectFailure?: (e: Error) => unknown
  onConnectSuccess?: (signerResponse: object) => unknown
  onDisconnect?: () => unknown
  realConnectDisabled?: boolean
}) {
  const [ik, setIk] = useState<null | IdentityKit>(null)
  const [connectedAccount, setConnectedAccount] = useState<string | undefined>()
  const [icpBalance, setIcpBalance] = useState<undefined | number>()
  const [agent, setAgent] = useState<SignerAgent<Signer> | null>(null)

  // create logout func
  const logout = useCallback(async () => {
    const onLogout = async () => {
      await selectedSigner?.transport.connection?.disconnect()
      await clearSigner()
      setConnectedAccount(undefined)
      setIcpBalance(undefined)
      setAgent(null)
      onDisconnect?.()
    }
    if (ik?.signerClient) {
      ik?.signerClient?.logout().then(onLogout)
    } else {
      await onLogout()
    }
  }, [ik?.signerClient, clearSigner, setConnectedAccount, setIcpBalance, onDisconnect, setAgent])

  useEffect(() => {
    setIk(null)
    // when signer is selected, but user is not connected, create indetity kit and trigger login
    if (selectedSigner && !ik?.signerClient) {
      IdentityKit.create<T>({
        authType: authType || (IdentityKitAuthType.ACCOUNTS as T),
        signerClientOptions: {
          ...signerClientOptions,
          crypto,
          signer: selectedSigner,
          idleOptions: {
            idleTimeout: DEFAULT_IDLE_TIMEOUT,
            ...signerClientOptions.idleOptions,
            onIdle: async () => {
              signerClientOptions.idleOptions?.onIdle?.()
              await logout()
            },
          },
        },
      }).then(async (instance) => {
        if (!realConnectDisabled) {
          if (!instance.signerClient.connectedUser) {
            try {
              const response = await instance.signerClient.login()
              setConnectedAccount(response.connectedAccount)
              onConnectSuccess?.(response.signerResponse)
            } catch (e) {
              await clearSigner()
              onConnectFailure?.(e as Error)
            }
          } else {
            setConnectedAccount(instance.signerClient.connectedUser.owner)
          }
        }
        setIk(instance as IdentityKit)
      })
    }
  }, [selectedSigner, realConnectDisabled])

  // fetch balance when user connected
  useEffect(() => {
    if (connectedAccount && !icpBalance) {
      ik?.getIcpBalance().then((b) => {
        setIcpBalance(b)
      })
    }
  }, [setIcpBalance, icpBalance, connectedAccount, ik])

  // create signer agent and save to state
  useEffect(() => {
    if (ik && connectedAccount) {
      ik.createSignerAgent({
        ...agentOptions,
        signer: selectedSigner!,
        account: Principal.fromText(connectedAccount),
      }).then((agent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAgent(agent as any)
      })
    }
  }, [ik, connectedAccount])

  return { agent, connectedAccount, logout, icpBalance }
}
