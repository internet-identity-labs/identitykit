import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  projects: [
    "examples/**/*/jest.config.ts", // Path to individual package Jest configurations
    "packages/**/*/jest.config.ts", // Path to individual package Jest configurations
  ],
}

export default config
