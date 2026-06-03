import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["dist/"],
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "mjs", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
}

export default config
