export {
  IdbStorage,
  LocalStorage,
  type AuthClientStorage as SignerStorage,
} from "@icp-sdk/auth/client"
import type { AuthClientStorage } from "@icp-sdk/auth/client"
import { DelegationChain, ECDSAKeyIdentity, Ed25519KeyIdentity } from "@icp-sdk/core/identity"

export const getIdentity = async (key: string, storage: AuthClientStorage) => {
  const value = await storage.get(`identity-${key}`)
  if (!value) return
  return typeof value === "string"
    ? Ed25519KeyIdentity.fromJSON(value)
    : ECDSAKeyIdentity.fromKeyPair(value)
}

export const setIdentity = async (
  key: string,
  identity: Ed25519KeyIdentity | ECDSAKeyIdentity,
  storage: AuthClientStorage
) => {
  const value =
    identity instanceof Ed25519KeyIdentity
      ? JSON.stringify(identity.toJSON())
      : identity.getKeyPair()
  return storage.set(`identity-${key}`, value)
}

export const removeIdentity = async (key: string, storage: AuthClientStorage) => {
  return storage.remove(`identity-${key}`)
}

export const getDelegationChain = async (key: string, storage: AuthClientStorage) => {
  const json = await storage.get(`delegation-${key}`)
  if (!json || typeof json !== "string") return
  return DelegationChain.fromJSON(json)
}

export const setDelegationChain = async (
  key: string,
  delegationChain: DelegationChain,
  storage: AuthClientStorage
) => {
  return storage.set(`delegation-${key}`, JSON.stringify(delegationChain.toJSON()))
}

export const removeDelegationChain = async (key: string, storage: AuthClientStorage) => {
  return storage.remove(`delegation-${key}`)
}
