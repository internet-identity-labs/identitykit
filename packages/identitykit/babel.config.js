module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" }, modules: false }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
}
