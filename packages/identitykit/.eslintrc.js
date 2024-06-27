/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@nfid/eslint-config/library.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  plugins: ["jest"],
  env: {
    jest: true,
    browser: true,
  },
}
