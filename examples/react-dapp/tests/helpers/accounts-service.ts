import { fail } from "assert"
import { readFile as readJSONFile, waitForLoaderDisappear } from "./helpers.js"
import { Page } from "@playwright/test"

/**
 * The Subject interface declares a set of methods for managing subscribers.
 */
export class UserService {
  /**
   * @type {number} For the sake of simplicity, the Subject's state, essential
   * to all subscribers, is stored in this variable.
   */
  private readonly page: Page
  public userMap: Map<TestUser, boolean> = new Map()
  public users: TestUser[] = []

  constructor(page: Page) {
    this.page = page
    this.users = readJSONFile("./users.json")
    this.users.map((user) => this.userMap.set(user, false))
  }

  public async takeUser(user: TestUser) {
    this.userMap.set(user, true)
  }

  //please note that this method should be used only for static users
  public async takeStaticUserByAnchor(anchor: number) {
    const user = this.users.find((user) => user.account.anchor == anchor)
    if (user) {
      await this.takeUser(user)
      return user
    }
    fail("All users borrowed")
  }

  async setAuth(anchor: number, page: Page, timeout: number = 50000): Promise<void> {
    await waitForLoaderDisappear(page)
    const testUser: TestUser = await this.takeStaticUserByAnchor(anchor)
    let errors: string[] = []

    while (true) {
      const result = await Promise.race([
        this.page.evaluate(
          async ({ testUser }) => {
            return new Promise<string>((resolve) => {
              // @ts-ignore
              if (typeof setAuthState === "function") {
                try {
                  // @ts-ignore
                  setAuthState(testUser.authstate)
                    .then((functionResult: string | Error) => {
                      resolve(String(functionResult))
                    })
                    .catch((error: Error) => {
                      resolve("error: " + error.message)
                    })
                } catch (e) {
                  const errorMessage =
                    e instanceof Error
                      ? `setAuthState error: ${e.message}`
                      : `setAuthState got unknown error`
                  resolve(errorMessage)
                }
              } else {
                resolve("setAuthState function is not available")
              }
            })
          },
          { testUser }
        ),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error("SetAuth timed out")), timeout)
        ),
      ]).catch((error) => `error: ${error.message}`)

      if (result.startsWith("error:") || result.startsWith("setAuthState error:")) {
        errors.push(result)
      }

      const state = await this.getAuthStateFromDB()
      errors.push(...state.errors)

      if (
        state.identity?.toString() === testUser.authstate.identity.toString() &&
        JSON.stringify(state.delegation) === JSON.stringify(testUser.authstate.delegation)
      ) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    if (errors.length > 0) {
      throw new Error(`Failed to set up authstate. Current state is: ${errors.join(", ")}`)
    }
  }

  async getAuthStateFromDB(): Promise<{
    identity: string | null
    delegation: string | null
    errors: string[]
  }> {
    return await this.page.evaluate(async () => {
      let errors: string[] = []
      try {
        const dbRequest = indexedDB.open("authstate")
        return await new Promise((resolve) => {
          dbRequest.onerror = () => {
            const errorMessage = dbRequest.error?.message || "Unknown error"
            errors.push(`Can't get "authstate" db. Error: ${errorMessage}`)
            resolve({ identity: null, delegation: null, errors })
          }
          dbRequest.onsuccess = () => {
            const db = dbRequest.result
            const transaction = db.transaction(["ic-keyval"], "readonly")
            const objectStore = transaction.objectStore("ic-keyval")

            const identityPromise = new Promise<string | null>((resolve, reject) => {
              const request = objectStore.get("identity")
              request.onsuccess = () => resolve(request.result ?? null)
              request.onerror = () =>
                reject(`Can't get identity value. Error: ${request.error?.message}`)
            })

            const delegationPromise = new Promise<string | null>((resolve, reject) => {
              const request = objectStore.get("delegation")
              request.onsuccess = () => resolve(request.result ?? null)
              request.onerror = () =>
                reject(`Can't get delegation value. Error: ${request.error?.message}`)
            })

            Promise.all([identityPromise, delegationPromise])
              .then(([identity, delegation]) => {
                resolve({ identity, delegation, errors })
              })
              .catch((error) => {
                errors.push(error)
                resolve({ identity: null, delegation: null, errors })
              })
          }
        })
      } catch (e) {
        errors.push(e instanceof Error ? e.message : "Unknown error")
        return { identity: null, delegation: null, errors }
      }
    })
  }

  async checkDatabaseExists(dbName: string): Promise<{
    result: boolean
    errors: string[]
  }> {
    return await this.page.evaluate(async (dbName) => {
      let errors: string[] = []
      return new Promise((resolve) => {
        const request = indexedDB.open(dbName)
        request.onupgradeneeded = () => {
          errors.push(`Upgrade is needed for DB: ${dbName}, possibly not exists.`)
        }
        request.onsuccess = () => {
          request.result.close()
          resolve({ result: true, errors })
        }
        request.onerror = () => {
          errors.push(
            `Error opening DB: ${dbName}. Error: ${request.error?.message || "Unknown error"}`
          )
          resolve({ result: false, errors })
        }
        request.onblocked = () => {
          errors.push(`Opening DB: ${dbName} is blocked, likely open connections.`)
        }
      })
    }, dbName)
  }

  async waitForDBAndDeleteDB(
    waitForDB: string,
    deleteDB: string
  ): Promise<{
    result: boolean
    errors: string[]
  }> {
    let errors: string[] = []
    await this.page.waitForTimeout(1000)
    const dbCheckResult = await this.checkDatabaseExists(waitForDB)
    errors.push(...dbCheckResult.errors)

    if (!dbCheckResult.result) {
      await this.page.evaluate(async (deleteDB) => {
        return new Promise((resolve) => {
          const deleteRequest = indexedDB.deleteDatabase(deleteDB)
          deleteRequest.onsuccess = () => resolve(true)
          deleteRequest.onerror = () => resolve(false)
        })
      }, deleteDB)

      await this.page.reload()
      await waitForLoaderDisappear(this.page)
    }

    const recheckResults = await this.checkDatabaseExists(waitForDB)
    errors.push(...recheckResults.errors)
    return {
      result: recheckResults.result,
      errors,
    }
  }
}
