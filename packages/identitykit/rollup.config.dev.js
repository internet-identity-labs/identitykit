import postcss from "rollup-plugin-postcss"
import { getComponentsFolders } from "./scripts/buildUtils.js"
import tailwindcss from "tailwindcss"
import dts from "rollup-plugin-dts"

const tailwindConfig = require("./tailwind.config.js")

const SUBPACKAGES = "libs"

// Returns rollup configuration for a given component
function component(folder) {
  return [
    {
      input: `src/${SUBPACKAGES}/${folder}/index.ts`,
      output: [{ file: `dist/${SUBPACKAGES}/${folder}/index.d.ts`, format: "esm" }],
      plugins: [dts.default()],
      external: [/\.css$/],
    },
    {
      input: `src/${SUBPACKAGES}/${folder}/styles.css`,
      output: [{ file: `dist/${SUBPACKAGES}/${folder}/index.css`, format: "es" }],
      plugins: [
        postcss({
          extensions: [".css"],
          extract: true,
          modules: false,
          config: {
            path: "./postcss.config.js",
          },
          plugins: [tailwindcss(tailwindConfig)],
          minimize: true,
        }),
      ],
    }
  ]
}

export default [
  // Build all components in ./src/libs
  ...[].concat.apply(
    [],
    getComponentsFolders(`./src/${SUBPACKAGES}`).map(component)
  ),
  {
    input: `src/index.ts`,
    output: [{ file: `dist/index.d.ts`, format: "esm" }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
]
