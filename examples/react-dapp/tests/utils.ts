import { test } from "@playwright/test"

export async function withRetries(
  action: () => Promise<void>,
  retryMessage?: string,
  retries?: number
): Promise<void> {
  const maxRetries = retries ?? test.info().project.metadata.retries
  let attempt = 0

  while (attempt <= maxRetries) {
    attempt++
    if (attempt > 1) {
      console.log(`Retry#${attempt - 1} | ${retryMessage}`)
    }

    try {
      await action()
      break
    } catch (error) {
      console.error(`Failed with error: ${error.message}`)

      test.info().errors.push({
        message: error.message,
        stack: error.stack,
      })
    }
  }
}
