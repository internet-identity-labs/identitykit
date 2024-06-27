import { idbRepository } from "./storage.service"

const key = "auth"

export interface Auth {
  permissions: string[]
}

export const authService = {
  async savePermissions(permissions: string[]): Promise<void> {
    await idbRepository.set(key, JSON.stringify({ permissions }))
  },

  async getPermissions(): Promise<string[]> {
    const authJson = await idbRepository.get(key)

    if (!authJson) {
      return []
    }

    const auth = JSON.parse(authJson) as Auth
    return auth.permissions
  },

  async revokePermissions(permissions?: string[]): Promise<string[]> {
    if (!permissions) {
      await idbRepository.remove(key)
      return []
    }
    const authJson = await idbRepository.get(key)

    if (!authJson) {
      return []
    }

    const auth = JSON.parse(authJson) as Auth
    const newPermissions = auth.permissions.filter((x) => !permissions.includes(x))
    await idbRepository.set(key, JSON.stringify({ permissions: newPermissions }))
    return newPermissions
  },

  async hasPermission(permission: string): Promise<boolean> {
    const authJson = await idbRepository.get(key)

    if (!authJson) {
      return false
    }

    const auth = JSON.parse(authJson) as Auth
    return auth.permissions.includes(permission)
  },
}
