import { test as base } from "@playwright/test"

const test = base.extend({})

test.afterEach(async () => {
  if (test.info().errors.length > 0) {
    const errorMessages = test
      .info()
      .errors.map((err) => {
        return `${err.message}`
      })
      .join("\n\n")
    throw new Error(errorMessages)
  }
})

export { test }
