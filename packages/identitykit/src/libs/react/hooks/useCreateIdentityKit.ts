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
import { SubAccount } from "@dfinity/ledger-icp"

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
  authType: T
  signerClientOptions?: T extends typeof IdentityKitAuthType.DELEGATION
    ? Omit<IdentityKitDelegationSignerClientOptions, "signer">
    : Omit<IdentityKitAccountsSignerClientOptions, "signer">
  agentOptions?: {
    agent?: IdentityKitSignerAgentOptions<Signer>["agent"]
  }
  onConnectFailure?: (e: Error) => unknown
  onConnectSuccess?: () => unknown
  onDisconnect?: () => unknown
  realConnectDisabled?: boolean
}) {
  const [ik, setIk] = useState<null | IdentityKit>(null)
  const [user, setUser] = useState<
    | {
        principal: Principal
        subaccount?: SubAccount
      }
    | undefined
  >()
  const [icpBalance, setIcpBalance] = useState<undefined | number>()
  const [agent, setAgent] = useState<SignerAgent<Signer> | null>(null)

  // create disconnect func
  const disconnect = useCallback(async () => {
    const finalFunc = async () => {
      await selectedSigner?.transport.connection?.disconnect()
      await clearSigner()
      setUser(undefined)
      setIcpBalance(undefined)
      setAgent(null)
      onDisconnect?.()
    }
    if (ik?.signerClient) {
      ik?.signerClient?.logout().then(finalFunc)
    } else {
      await finalFunc()
    }
  }, [ik?.signerClient, clearSigner, setUser, setIcpBalance, onDisconnect, setAgent])

  // create fetchBalance func
  const fetchIcpBalance = useCallback(() => {
    return ik?.getIcpBalance().then(setIcpBalance)
  }, [ik, setIcpBalance])

  useEffect(() => {
    setIk(null)
    // when signer is selected, but user is not connected, create indetity kit and trigger login
    if (selectedSigner && !ik?.signerClient) {
      IdentityKit.create<T>({
        authType,
        signerClientOptions: {
          ...signerClientOptions,
          crypto,
          signer: selectedSigner,
          idleOptions: {
            idleTimeout: DEFAULT_IDLE_TIMEOUT,
            ...signerClientOptions.idleOptions,
            onIdle: async () => {
              signerClientOptions.idleOptions?.onIdle?.()
              await disconnect()
            },
          },
        },
      }).then(async (instance) => {
        if (!realConnectDisabled) {
          if (!instance.signerClient.connectedUser) {
            try {
              await instance.signerClient.login()
              setUser(instance.signerClient.connectedUser)
              onConnectSuccess?.()
            } catch (e) {
              await clearSigner()
              onConnectFailure?.(e as Error)
            }
          } else {
            setUser(instance.signerClient.connectedUser)
          }
        }
        setIk(instance as IdentityKit)
      })
    }
  }, [selectedSigner, realConnectDisabled])

  // fetch balance when user connected
  useEffect(() => {
    if (icpBalance === undefined && user) {
      fetchIcpBalance()
    }
  }, [icpBalance, user, fetchIcpBalance])

  // create signer agent and save to state
  useEffect(() => {
    if (ik && user) {
      ik.createSignerAgent({
        ...agentOptions,
        signer: selectedSigner!,
        account: user.principal,
      }).then((agent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAgent(agent as any)
      })
    }
  }, [ik, user])

  return {
    agent,
    user,
    disconnect,
    icpBalance,
    signerClient: ik?.signerClient,
    fetchIcpBalance: user ? (fetchIcpBalance as () => Promise<void>) : undefined,
  }
}
