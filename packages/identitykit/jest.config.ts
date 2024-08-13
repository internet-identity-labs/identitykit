import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["dist/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.svg$": "jest-transform-stub",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
}

export default config
