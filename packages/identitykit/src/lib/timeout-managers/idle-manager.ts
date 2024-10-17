import { DEFAULT_IDLE_TIMEOUT } from "../constants"
import { TimeoutManager } from "./timeout-manager"

export type IdleManagerOptions = {
  /**
   * capture scroll events
   * @default false
   */
  captureScroll?: boolean
  /**
   * scroll debounce time in ms
   * @default 100
   */
  scrollDebounce?: number
  /**
   * Callback after the user has gone idle
   */
  onIdle?: () => unknown
  /**
   * timeout in ms
   */
  idleTimeout?: number
}

const events = ["mousedown", "mousemove", "keydown", "touchstart", "wheel"]

/**
 * Detects if the user has been idle for a duration of `idleTimeout` ms, and calls `onIdle` and registered callbacks.
 * By default, the IdleManager will log a user out after 10 minutes of inactivity.
 * To override these defaults, you can pass an `onIdle` callback, or configure a custom `idleTimeout` in milliseconds
 */
export class IdleManager extends TimeoutManager {
  constructor(options: IdleManagerOptions = {}) {
    super({ timeout: options.idleTimeout || DEFAULT_IDLE_TIMEOUT, onTimeout: options.onIdle })
    const _resetTimer = this._resetTimer.bind(this)
    events.forEach(function (name) {
      document.addEventListener(name, _resetTimer, true)
    })

    // eslint-disable-next-line @typescript-eslint/ban-types
    const debounce = (func: Function, wait: number) => {
      let timeout: number | undefined
      return (...args: unknown[]) => {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this
        const later = function () {
          timeout = undefined
          func.apply(context, args)
        }
        clearTimeout(timeout)
        timeout = window.setTimeout(later, wait)
      }
    }

    if (options?.captureScroll) {
      // debounce scroll events
      const scroll = debounce(_resetTimer, options?.scrollDebounce ?? 100)
      window.addEventListener("scroll", scroll, true)
    }
  }
}
