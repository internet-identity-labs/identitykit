import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "rollup-plugin-typescript2"
import replace from "@rollup/plugin-replace"
import postcss from "rollup-plugin-postcss"
import svgr from "@svgr/rollup"
import { getComponentsFolders } from "./scripts/buildUtils.js"
import generatePackageJson from "rollup-plugin-generate-package-json"
import tailwindcss from "tailwindcss"

const packageJson = require("./package.json")
const tailwindConfig = require("./tailwind.config.js")

const commonPlugins = [
  replace({
    preventAssignment: true,
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    __IS_DEV__: process.env.NODE_ENV === "development",
  }),
  resolve(),
  commonjs(),
  typescript({
    tsconfig: "./tsconfig.json",
    useTsconfigDeclarationDir: true,
  }),
  postcss({
    extensions: [".css"],
    extract: true,
    modules: true,
    config: {
      path: "./postcss.config.js",
    },
    plugins: [tailwindcss(tailwindConfig)],
  }),
  svgr(),
]

const SUBPACKAGES = "src/libs"

// Returns rollup configuration for a given component
function component(commonPlugins, folder) {
  return {
    input: `${SUBPACKAGES}/${folder}/index.ts`,
    output: [
      {
        file: `dist/${folder}/index.esm.js`,
        exports: "named",
        format: "esm",
        banner: `'use client';`,
      },
      {
        file: `dist/${folder}/index.cjs.js`,
        exports: "named",
        format: "cjs",
        banner: `'use client';`,
      },
    ],
    plugins: [
      ...commonPlugins,
      generatePackageJson({
        baseContents: {
          name: `${packageJson.name}/${folder}`,
          private: true,
          main: "./index.cjs.js",
          module: "./index.esm.js",
          types: "./index.d.ts",
          style: "./index.cjs.css",
          exports: {
            "./styles.css": {
              import: "./index.cjs.css",
              require: "./index.cjs.css",
              default: "./index.cjs.css",
            },
          },
          peerDependencies: packageJson.peerDependencies,
        },
        outputFolder: `dist/${folder}/`,
      }),
    ],
    // Don't bundle node_modules and ../utils
    //
    // We should also exclude relative imports of other components, but a trivial exclude of /\.\./ does not work
    // It may require changes to the way the components are exported
    external: [/node_modules/, /\.\.\/utils/],
  }
}

export default [
  // Build all components in ./src/*
  ...getComponentsFolders(`./${SUBPACKAGES}`).map((folder) => component(commonPlugins, folder)),

  // Build the main file that includes all components and utils
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.esm.js",
        exports: "named",
        format: "esm",
        banner: `'use client';`,
      },
      {
        file: "dist/index.cjs.js",
        exports: "named",
        format: "cjs",
        banner: `'use client';`,
      },
    ],
    plugins: commonPlugins,
    external: [/node_modules/],
  },
]
