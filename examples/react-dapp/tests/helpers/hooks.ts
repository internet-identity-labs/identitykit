import { test as base } from "@playwright/test"

const test = base.extend({})

test.afterEach(async () => {})
test.beforeEach(async () => {})

export { test }
