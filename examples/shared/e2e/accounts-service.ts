import { Page } from "@playwright/test"
import { MAX_WAIT_MS } from "./config.js"
import { waitForLoaderDisappear } from "./helpers.js"
import { AuthState, authStateExpiresAt, getTestUser, TestUser } from "./users.js"

// Fail before the test starts if the stored session would expire mid-run.
const MIN_AUTHSTATE_VALIDITY_MS = 60 * 60 * 1000

function assertAuthStateValid(user: TestUser): void {
  const expiresAt = authStateExpiresAt(user)
  if (expiresAt.getTime() - Date.now() < MIN_AUTHSTATE_VALIDITY_MS)
    throw new Error(
      `authstate of test user ${user.account.anchor} expired (or expires) at ${expiresAt.toISOString()}. ` +
        `Generate a new delegation from the user's seed and update examples/shared/e2e/users.json.`
    )
}

export class UserService {
  constructor(private readonly page: Page) {}

  /**
   * Logs the NFID page in as the test user via the `setAuthState` hook that NFID exposes
   * on non-production environments, retrying until the session is stored or `timeout`.
   */
  async setAuth(anchor: number, page: Page, timeout: number = MAX_WAIT_MS): Promise<void> {
    await waitForLoaderDisappear(page)
    const testUser = getTestUser(anchor)
    assertAuthStateValid(testUser)

    const deadline = Date.now() + timeout
    const errors: string[] = []

    for (;;) {
      const remaining = deadline - Date.now()
      if (remaining <= 0)
        throw new Error(
          `Failed to log in test user ${anchor} within ${timeout} ms. ` +
            `Errors: ${errors.join(", ") || "none, the session never appeared in IndexedDB"}`
        )

      const result = await Promise.race([
        this.callSetAuthState(testUser.authstate),
        new Promise<string>((resolve) =>
          setTimeout(() => resolve("error: setAuthState timed out"), remaining)
        ),
      ]).catch((error: Error) => `error: ${error.message}`)
      if (result.startsWith("error:") || result.startsWith("setAuthState error:")) {
        errors.push(result)
      }

      const state = await this.getAuthStateFromDB()
      errors.push(...state.errors)

      if (
        state.identity?.toString() === testUser.authstate.identity.toString() &&
        JSON.stringify(state.delegation) === JSON.stringify(testUser.authstate.delegation)
      )
        break

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    if (errors.length > 0) {
      throw new Error(`Failed to set up authstate. Current state is: ${errors.join(", ")}`)
    }
  }

  private async callSetAuthState(authstate: AuthState): Promise<string> {
    return this.page.evaluate(async (authstate) => {
      const { setAuthState } = window as unknown as {
        setAuthState?: (state: unknown) => Promise<string | Error>
      }
      if (typeof setAuthState !== "function") return "setAuthState function is not available"
      try {
        return String(await setAuthState(authstate))
      } catch (e) {
        return e instanceof Error
          ? `setAuthState error: ${e.message}`
          : "setAuthState got unknown error"
      }
    }, authstate)
  }

  async getAuthStateFromDB(): Promise<{
    identity: string | null
    delegation: string | null
    errors: string[]
  }> {
    return await this.page.evaluate(async () => {
      const errors: string[] = []
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
}
