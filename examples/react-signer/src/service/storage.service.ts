import { openDB, IDBPDatabase } from "idb"

export const DB_VERSION = 1
type Database = IDBPDatabase<unknown>
type IDBValidKey = string | number | Date | BufferSource | IDBValidKey[]
const DB_NAME = "signer"
const OBJECT_STORE_NAME = "permissions"

export class IdbRepository {
  private initializedDb: IdbKeyVal | undefined

  get _db(): Promise<KeyValueStore> {
    const db = new Promise<KeyValueStore>((resolve) => {
      if (this.initializedDb) {
        this.initializedDb.set("test", "test")
        this.initializedDb.get("test")
        resolve(this.initializedDb)
        return
      }
      IdbKeyVal.create({ dbName: "signer", storeName: "user", version: DB_VERSION })
        .then((db) => {
          this.initializedDb = db
          this.initializedDb.set("test", "test")
          this.initializedDb.get("test")
          resolve(db)
        })
        .catch(() => {
          return resolve(MemoryKeyVal.create())
        })
    })
    return db
  }

  public async get(key: string): Promise<string | null> {
    const db = await this._db
    return await db.get<string>(key)
  }

  public async set(key: string, value: string): Promise<void> {
    const db = await this._db
    await db.set(key, value)
  }

  public async remove(key: string): Promise<void> {
    const db = await this._db
    await db.remove(key)
  }
}

export const idbRepository = new IdbRepository()

const _openDbStore = async (dbName = DB_NAME, storeName = OBJECT_STORE_NAME, version: number) => {
  console.debug("_openDbStore", { dbName, storeName, version })
  return await openDB(dbName, version, {
    upgrade: (database) => {
      if (database.objectStoreNames.contains(storeName)) {
        database.clear(storeName)
      }
      database.createObjectStore(storeName)
    },
  })
}

async function _getValue<T>(
  db: Database,
  storeName: string,
  key: IDBValidKey
): Promise<T | undefined> {
  return await db.get(storeName, key)
}

async function _setValue<T>(
  db: Database,
  storeName: string,
  key: IDBValidKey,
  value: T
): Promise<IDBValidKey> {
  return await db.put(storeName, value, key)
}

async function _removeValue(db: Database, storeName: string, key: IDBValidKey): Promise<void> {
  return await db.delete(storeName, key)
}

export type DBCreateOptions = {
  dbName?: string
  storeName?: string
  version?: number
}

export interface KeyValueStore {
  get<T>(key: IDBValidKey): Promise<T | null>
  set<T>(key: IDBValidKey, value: T): Promise<IDBValidKey>
  remove(key: IDBValidKey): Promise<void>
}

/**
 * Simple Key Value store
 */
export class IdbKeyVal implements KeyValueStore {
  /**
   *
   * @param {DBCreateOptions} options {@link DbCreateOptions}
   * @param {DBCreateOptions['dbName']} options.dbName name for the indexeddb database
   * @default 'auth-client-db'
   * @param {DBCreateOptions['storeName']} options.storeName name for the indexeddb Data Store
   * @default 'ic-keyval'
   * @param {DBCreateOptions['version']} options.version version of the database. Increment to safely upgrade
   * @constructs an {@link IdbKeyVal}
   */
  public static async create(options?: DBCreateOptions): Promise<IdbKeyVal> {
    console.debug("IdbKeyVal.create", { options })
    const { dbName = DB_NAME, storeName = OBJECT_STORE_NAME, version = 1 } = options ?? {}
    const db = await _openDbStore(dbName, storeName, version)
    return new IdbKeyVal(db, storeName)
  }

  // Do not use - instead prefer create
  private constructor(
    private _db: Database,
    private _storeName: string
  ) {}

  /**
   * Basic setter
   * @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
   * @param value value to set
   * @returns void
   */
  public async set<T>(key: IDBValidKey, value: T) {
    return await _setValue<T>(this._db, this._storeName, key, value)
  }
  /**
   * Basic getter
   * Pass in a type T for type safety if you know the type the value will have if it is found
   * @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
   * @returns `Promise<T | null>`
   * @example
   * await get<string>('exampleKey') -> 'exampleValue'
   */
  public async get<T>(key: IDBValidKey): Promise<T | null> {
    return (await _getValue<T>(this._db, this._storeName, key)) ?? null
  }

  /**
   * Remove a key
   * @param key {@link IDBValidKey}
   * @returns void
   */
  public async remove(key: IDBValidKey) {
    return await _removeValue(this._db, this._storeName, key)
  }
}

export class MemoryKeyVal implements KeyValueStore {
  constructor(private _map: Map<IDBValidKey, unknown>) {}

  public static create(): MemoryKeyVal {
    const map = new Map<string, IDBValidKey>()
    return new MemoryKeyVal(map)
  }

  /**
   * Basic setter
   * @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
   * @param value value to set
   * @returns void
   */
  public async set<T>(key: IDBValidKey, value: T): Promise<IDBValidKey> {
    console.debug("MemoryKeyVal.set", { key })
    this._map.set(key, value) as T
    return key
  }

  /**
   * Basic getter
   * Pass in a type T for type safety if you know the type the value will have if it is found
   * @param {IDBValidKey} key string | number | Date | BufferSource | IDBValidKey[]
   * @returns `Promise<T | null>`
   * @example
   * await get<string>('exampleKey') -> 'exampleValue'
   */
  public async get<T>(key: IDBValidKey): Promise<T | null> {
    console.debug("MemoryKeyVal.get", { key })
    return this._map.get(key) as T
  }

  /**
   * Remove a key
   * @param key {@link IDBValidKey}
   * @returns void
   */
  public async remove(key: IDBValidKey): Promise<void> {
    console.debug("MemoryKeyVal.remove", { key })
    this._map.delete(key)
  }
}
