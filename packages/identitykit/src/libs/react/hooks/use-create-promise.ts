import { useCallback, useRef, useState } from "react"

export function useCreatePromise<T>() {
  // Internal state to force re-renders when the promise resolves
  const [, setResolvedValue] = useState<unknown>()

  // Store the promise and its resolve/reject handlers in a ref
  const promiseRef = useRef<{
    promise: Promise<T> | null
    resolve: ((value: T) => void) | null
    reject: ((reason?: unknown) => void) | null
  }>({
    promise: null,
    resolve: null,
    reject: null,
  })

  // Create the promise
  const createPromise = useCallback(() => {
    promiseRef.current.promise = new Promise((resolve, reject) => {
      promiseRef.current.resolve = resolve
      promiseRef.current.reject = reject
    })
    return promiseRef.current.promise
  }, [])

  // Resolve the promise
  const resolve = useCallback((value: T) => {
    if (promiseRef.current.resolve) {
      promiseRef.current.resolve(value)
      setResolvedValue(value) // Trigger re-render
    }
  }, [])

  // Reject the promise
  const reject = useCallback((error: unknown) => {
    if (promiseRef.current.reject) {
      promiseRef.current.reject(error)
      setResolvedValue(undefined) // Trigger re-render (optional)
    }
  }, [])

  return { createPromise, resolve, reject, promise: promiseRef.current.promise }
}
