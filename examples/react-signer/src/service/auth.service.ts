import { Record } from "@dfinity/candid/lib/cjs/idl"
import { GenericError, NotSupportedError } from "./exception-handler.service"
import { idbRepository } from "./storage.service"

const key = "auth"

export enum PermissionMethod {
  ICRC34_DELEGATION = "icrc34_delegation",
  ICRC27_ACCOUNTS = "icrc27_accounts",
  ICRC49_CALL_CANISTER = "icrc49_call_canister",
}

export enum PermissionState {
  GRANTED = "granted",
  ASK_ON_USE = "ask_on_use",
  DENIED = "denied",
}

export interface Auth {
  permissions: Record<PermissionMethod, PermissionState>
}

export const authService = {
  async initPermissions(): Promise<void> {
    const authJson = await idbRepository.get(key)
    if (!authJson) {
      const permissions: Record<PermissionMethod, PermissionState> = Object.values(
        PermissionMethod
      ).reduce(
        (acc, method) => {
          acc[method] = PermissionState.ASK_ON_USE
          return acc
        },
        {} as Record<PermissionMethod, PermissionState>
      )

      await idbRepository.set(key, JSON.stringify({ permissions }))
    }
  },

  async savePermissions(
    permissionMethods: string[],
    permissionState: PermissionState
  ): Promise<Record<PermissionMethod, PermissionState>> {
    const methods: PermissionMethod[] = permissionMethods.map((methodName) =>
      getPermissionMethod(methodName)
    )
    const authState = await getAuthState()

    const permissionsNew: Record<PermissionMethod, PermissionState> = methods.reduce(
      (acc, method) => {
        acc[method] = permissionState
        return acc
      },
      {} as Record<PermissionMethod, PermissionState>
    )

    const permissions = {
      ...authState.permissions,
      ...permissionsNew,
    }

    await idbRepository.set(key, JSON.stringify({ permissions }))

    return this.getPermissions()
  },

  async getPermissions(): Promise<Record<PermissionMethod, PermissionState>> {
    const authState = await getAuthState()
    return authState.permissions
  },

  async hasPermission(methodName: string): Promise<boolean> {
    const method = getPermissionMethod(methodName)
    const authState = await getAuthState()
    return authState.permissions[method] === PermissionState.GRANTED
  },

  validatePermissionMethodNames(methodNames: string[]): void {
    methodNames.map((methodName) => getPermissionMethod(methodName))
  },
}

function getPermissionMethod(methodName: string): PermissionMethod {
  const method = PermissionMethod[methodName.toUpperCase() as keyof typeof PermissionMethod]

  if (!method) {
    throw new NotSupportedError(`The method name ${methodName} is not supported`)
  }

  return method
}

async function getAuthState(): Promise<Auth> {
  const authJson = await idbRepository.get(key)

  if (!authJson) {
    throw new GenericError(`The auth state is empty. Refresh your page.`)
  }

  return JSON.parse(authJson) as Auth
}
