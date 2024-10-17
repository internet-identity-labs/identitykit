import { DEFAULT_IDLE_TIMEOUT } from "../constants"
import { IdleManager } from "./idle-manager"

describe("IdleManager", () => {
  let originalClearTimeout: typeof clearTimeout
  let originalSetTimeout: typeof setTimeout

  beforeAll(() => {
    originalClearTimeout = global.clearTimeout
    originalSetTimeout = global.setTimeout
  })

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterAll(() => {
    global.clearTimeout = originalClearTimeout
    global.setTimeout = originalSetTimeout
  })

  it("should initialize with default options", () => {
    const idleManager = new IdleManager()

    expect(idleManager.timeout).toBe(DEFAULT_IDLE_TIMEOUT)
    expect(idleManager.callbacks).toEqual([])
  })

  it("should initialize with custom options", () => {
    const mockCallback = jest.fn()
    const idleManager = new IdleManager({
      onIdle: mockCallback,
      idleTimeout: 5 * 60 * 1000,
      captureScroll: true,
      scrollDebounce: 200,
    })

    expect(idleManager.timeout).toBe(5 * 60 * 1000)
    expect(idleManager.callbacks).toEqual([mockCallback])
  })

  it("should register a new callback", () => {
    const mockCallback = jest.fn()
    const idleManager = new IdleManager()

    idleManager.registerCallback(mockCallback)

    expect(idleManager.callbacks).toContain(mockCallback)
  })

  it("should reset timeout and call the onIdle callback", () => {
    const mockCallback = jest.fn()
    const idleManager = new IdleManager({
      onIdle: mockCallback,
      idleTimeout: 1000,
    })

    idleManager._resetTimer()

    jest.advanceTimersByTime(1000)

    expect(mockCallback).toHaveBeenCalled()
  })

  it("should clean up listeners on exit", () => {
    const clearTimeoutMock = jest.fn()
    global.clearTimeout = clearTimeoutMock

    const idleManager = new IdleManager()

    idleManager.exit()

    expect(clearTimeoutMock).toHaveBeenCalledWith(idleManager.timeoutID)
  })
})
