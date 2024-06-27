import { Ed25519KeyIdentity } from "@dfinity/identity"
import { SubAccount } from "@dfinity/ledger-icp"
import { idbRepository } from "./storage.service"
import { JsonnableEd25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519"

const key = "accounts"

export interface Account {
  id: number
  displayName: string
  principal: string
  subaccount: string
  type: AccountType
}

export interface AccountKeyIdentity {
  id: number
  keyIdentity: Ed25519KeyIdentity
  type: AccountType
}

export enum AccountType {
  GLOBAL = "GLOBAL",
  SESSION = "SESSION",
}

interface AccountEntity {
  id: number
  displayName: string
  subaccount: number
  keyIdentity: string
  type: AccountType
}

const identityKeyJson: JsonnableEd25519KeyIdentity = [
  "302a300506032b65700321003b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
  "00000000000000000000000000000000000000000000000000000000000000003b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
]

const sessionKeyJson: JsonnableEd25519KeyIdentity = [
  "302a300506032b65700321003008adc857dfcd0477a7aaa01a657ca6923ce76c07645704b1e872deb1253baa",
  "de33b3c3ed88942af13cb4fe4384f9e9126d8af5482dbc9ccd71208f250bdaed",
]

export const accountService = {
  async initWithPredefinedUsers(): Promise<void> {
    const accountEntities: AccountEntity[] = [
      {
        id: 1,
        displayName: "Account #1",
        keyIdentity: JSON.stringify(identityKeyJson),
        subaccount: 0,
        type: AccountType.GLOBAL,
      },
      {
        id: 2,
        displayName: "Account #2",
        keyIdentity: JSON.stringify(sessionKeyJson),
        subaccount: 1,
        type: AccountType.SESSION,
      },
    ]

    await idbRepository.set(key, JSON.stringify(accountEntities))
  },

  async getAccounts(): Promise<Account[]> {
    const accountsJson = await idbRepository.get(key)

    if (!accountsJson) {
      return []
    }

    const accountEntities = JSON.parse(accountsJson) as AccountEntity[]

    const accounts: Account[] = accountEntities.map((account) => {
      const keyIdentity = Ed25519KeyIdentity.fromJSON(account.keyIdentity)
      const subAccount = SubAccount.fromID(account.subaccount)
      const principal = keyIdentity.getPrincipal().toText()
      return {
        id: account.id,
        displayName: principal,
        principal,
        subaccount: Buffer.from(subAccount.toUint8Array()).toString("base64"),
        type: account.type,
      }
    })

    return accounts
  },

  async getAccountKeyIdentityById(id: number): Promise<AccountKeyIdentity | undefined> {
    const accountsJson = await idbRepository.get(key)

    if (!accountsJson) {
      return undefined
    }

    const accountEntities = JSON.parse(accountsJson) as AccountEntity[]
    const accountEntity = accountEntities.find((x) => x.id === id)

    if (!accountEntity) {
      return undefined
    }

    return {
      id: accountEntity.id,
      keyIdentity: Ed25519KeyIdentity.fromJSON(accountEntity.keyIdentity),
      type: accountEntity.type,
    }
  },

  async getAccountKeyIdentityByPrincipal(
    principal: string
  ): Promise<Ed25519KeyIdentity | undefined> {
    const accountsJson = await idbRepository.get(key)

    if (!accountsJson) {
      return undefined
    }

    const accountEntities = JSON.parse(accountsJson) as AccountEntity[]
    const accountEntity = accountEntities.find((x) => {
      const keyIdentity = Ed25519KeyIdentity.fromJSON(x.keyIdentity)
      return principal === keyIdentity.getPrincipal().toText()
    })

    if (!accountEntity) {
      return undefined
    }

    return Ed25519KeyIdentity.fromJSON(accountEntity.keyIdentity)
  },
}
