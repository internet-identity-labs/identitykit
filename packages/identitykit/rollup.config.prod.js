import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "rollup-plugin-typescript2"
import replace from "@rollup/plugin-replace"
import postcss from "rollup-plugin-postcss"
import svgr from "@svgr/rollup"
import { getComponentsFolders } from "./scripts/buildUtils.js"
import generatePackageJson from "rollup-plugin-generate-package-json"
import tailwindcss from "tailwindcss"
import dts from "rollup-plugin-dts"
import fs from "fs"
import path from "path"

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
    include: ["src/**/*", "types/*.d.ts"],
    exclude: ["**/*.spec.tsx", "./*.ts"],
    verbosity: 2,
  }),
  svgr(),
]

const SUBPACKAGES = "libs"

// Returns rollup configuration for a given component
function component(commonPlugins, folder) {
  return [
    {
      input: `src/${SUBPACKAGES}/${folder}/index.ts`,
      output: [
        {
          file: `dist/${SUBPACKAGES}/${folder}/index.esm.js`,
          exports: "named",
          format: "esm",
          banner: `'use client';`,
        },
        {
          file: `dist/${SUBPACKAGES}/${folder}/index.cjs.js`,
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
                import: "./index.css",
                require: "./index.css",
                default: "./index.css",
              },
            },
            peerDependencies: packageJson.peerDependencies,
          },
          outputFolder: `dist/${SUBPACKAGES}/${folder}/`,
        }),
      ],
      // Don't bundle node_modules and ../utils
      //
      // We should also exclude relative imports of other components, but a trivial exclude of /\.\./ does not work
      // It may require changes to the way the components are exported
      external: [/node_modules/],
    },
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
    },
  ]
}

const manualGeneratePackageJson = () => ({
  name: "manual-generate-package-json",
  buildEnd() {
    const targetPath = path.resolve("package.json")
    const updatedPackageJson = {
      ...packageJson,
      exports: packageJson.exportsProd,
      exportsProd: undefined,
    }
    fs.writeFileSync(targetPath, JSON.stringify(updatedPackageJson, null, 2), "utf-8")
    console.log(`Generated package.json at ${targetPath}`)
  },
})

export default [
  // Build all components in ./src/libs
  ...[].concat.apply(
    [],
    getComponentsFolders(`./src/${SUBPACKAGES}`).map((folder) => component(commonPlugins, folder))
  ),

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
    plugins: [...commonPlugins, manualGeneratePackageJson()],
    external: [/node_modules/],
  },
  {
    input: `src/index.ts`,
    output: [{ file: `dist/index.d.ts`, format: "esm" }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
]
