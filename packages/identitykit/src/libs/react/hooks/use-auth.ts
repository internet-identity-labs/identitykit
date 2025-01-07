import { useConnect, useDisconnect, useIsUserConnecting, useUser } from "./context-selectors"

export function useAuth() {
  const user = useUser()
  const isConnecting = useIsUserConnecting()
  const connect = useConnect()
  const disconnect = useDisconnect()

  return {
    user,
    isConnecting,
    connect,
    disconnect,
  }
}
