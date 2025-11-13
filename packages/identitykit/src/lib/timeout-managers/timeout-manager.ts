/** @module IdleManager */
type TimeoutCB = () => unknown

export type TimeoutManagerOptions = {
  /**
   * Callback after the timeout
   */
  onTimeout?: TimeoutCB
  /**
   * timeout in ms
   */
  timeout: number
}

const TIMEOUT_MAX_DELAY = 2147483647

/**
 * Detects if the `timeout` ms is over, and calls `onTimeout` and registered callbacks.
 * To override these defaults, you can pass an `onTimeout` callback, or configure a custom `timeout` in milliseconds
 */
export class TimeoutManager {
  callbacks: TimeoutCB[] = []
  timeout?: TimeoutManagerOptions["timeout"]
  timeoutID?: number = undefined

  /**
   * @param options {@link IdleManagerOptions}
   */
  constructor(options: TimeoutManagerOptions) {
    const { onTimeout, timeout } = options || {}

    this.callbacks = onTimeout ? [onTimeout] : []
    this.timeout = timeout > TIMEOUT_MAX_DELAY ? TIMEOUT_MAX_DELAY : timeout

    const _resetTimer = this._resetTimer.bind(this)

    window.addEventListener("load", _resetTimer, true)

    _resetTimer()
  }

  /**
   * @param {TimeoutCB} callback function to be called on timeout
   */
  public registerCallback(callback: TimeoutCB): void {
    this.callbacks.push(callback)
  }

  /**
   * Cleans up the timeout manager and its listeners
   */
  public exit(): void {
    clearTimeout(this.timeoutID)
    window.removeEventListener("load", this._resetTimer, true)
  }

  /**
   * Resets the timeouts during cleanup
   */
  _resetTimer(): void {
    window.clearTimeout(this.timeoutID)
    this.timeoutID = window.setTimeout(() => {
      this.callbacks.forEach((cb) => cb())
    }, this.timeout)
  }
}
