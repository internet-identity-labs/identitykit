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
    const idleManager = IdleManager.create()

    expect(idleManager.idleTimeout).toBe(10 * 60 * 1000)
    expect(idleManager.callbacks).toEqual([])
  })

  it("should initialize with custom options", () => {
    const mockCallback = jest.fn()
    const idleManager = IdleManager.create({
      onIdle: mockCallback,
      idleTimeout: 5 * 60 * 1000,
      captureScroll: true,
      scrollDebounce: 200,
    })

    expect(idleManager.idleTimeout).toBe(5 * 60 * 1000)
    expect(idleManager.callbacks).toEqual([mockCallback])
  })

  it("should register a new callback", () => {
    const mockCallback = jest.fn()
    const idleManager = IdleManager.create()

    idleManager.registerCallback(mockCallback)

    expect(idleManager.callbacks).toContain(mockCallback)
  })

  it("should reset timeout and call the onIdle callback", () => {
    const mockCallback = jest.fn()
    const idleManager = IdleManager.create({
      onIdle: mockCallback,
      idleTimeout: 1000,
    })

    idleManager._resetTimer()

    jest.advanceTimersByTime(1000)

    expect(mockCallback).toHaveBeenCalled()
  })

  it("should clean up listeners and execute registered callbacks on exit", () => {
    const mockCallback = jest.fn()
    const clearTimeoutMock = jest.fn()
    global.clearTimeout = clearTimeoutMock

    const idleManager = IdleManager.create({
      onIdle: mockCallback,
    })

    idleManager.exit()

    expect(mockCallback).toHaveBeenCalled()
    expect(clearTimeoutMock).toHaveBeenCalledWith(idleManager.timeoutID)
  })
})
