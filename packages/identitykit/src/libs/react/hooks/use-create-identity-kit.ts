import { useCallback, useEffect, useMemo, useState } from "react"
import {
  IdentityKitAuthType,
  IdentityKit,
  IdentityKitAccountsSignerClientOptions,
  IdentityKitDelegationSignerClientOptions,
  IdentityKitDelegationSignerClient,
} from "../../../lib"
import { Signer } from "@slide-computer/signer"
import { Principal } from "@dfinity/principal"
import { SubAccount } from "@dfinity/ledger-icp"
import { AnonymousIdentity } from "@dfinity/agent"

export function useCreateIdentityKit<
  T extends IdentityKitAuthType = typeof IdentityKitAuthType.ACCOUNTS,
>({
  selectedSigner,
  clearSigner,
  signerClientOptions = {},
  authType,
  onConnectFailure,
  onConnectSuccess,
  realConnectDisabled,
  ...props
}: {
  selectedSigner?: Signer
  clearSigner: () => Promise<unknown>
  authType: T
  signerClientOptions?: T extends typeof IdentityKitAuthType.DELEGATION
    ? Omit<IdentityKitDelegationSignerClientOptions, "signer" | "onLogout">
    : Omit<IdentityKitAccountsSignerClientOptions, "signer" | "onLogout">
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

  const onDisconnect = useCallback(async () => {
    setIk(null)
    setUser(undefined)
    setIcpBalance(undefined)
    await selectedSigner?.transport.connection?.disconnect()
    await clearSigner()
    props.onDisconnect?.()
  }, [ik?.signerClient, clearSigner, props.onDisconnect])

  // create disconnect func
  const disconnect = useCallback(async () => {
    return await ik?.signerClient?.logout()
  }, [ik?.signerClient])

  // create fetchBalance func
  const fetchIcpBalance = useMemo(() => {
    if (!user || !ik) return
    return () => ik.getIcpBalance().then(setIcpBalance)
  }, [ik, user, setIcpBalance])

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
          onLogout: onDisconnect,
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
            if (
              (
                instance.signerClient as IdentityKitDelegationSignerClient
              ).getIdentity?.() instanceof AnonymousIdentity
            ) {
              await instance.signerClient.logout()
              await disconnect()
              return
            }
            setUser(instance.signerClient.connectedUser)
          }
        }
        setIk(instance as IdentityKit)
      })
    }
  }, [selectedSigner, realConnectDisabled])

  // fetch balance when user connected
  useEffect(() => {
    if (icpBalance === undefined) {
      fetchIcpBalance?.()
    }
  }, [icpBalance, user, fetchIcpBalance])

  return {
    user,
    disconnect,
    icpBalance,
    signerClient: ik?.signerClient,
    fetchIcpBalance,
  }
}
