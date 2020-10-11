import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import replace from "@rollup/plugin-replace"
import strip from "@rollup/plugin-strip"

const isProd = process.env.NODE_ENV === "production"
const extensions = [".js", ".ts"]

const plugins = [
  resolve({ extensions }),
  babel({
    babelHelpers: "bundled",
    extensions,
    include: ["src/**/*"],
  }),
  commonjs(),
]

const output = {
  dir: "dist",
  // format: "esm",
}

if (isProd) {
  plugins.unshift(replace({ "//prod:": "", delimiters: ["", ""] }))
  plugins.push(strip({ include: ["**/*.(t|j)s"] }), terser())
}

const background = {
  input: "src/background.ts",
  output,
  plugins,
}

const content = {
  input: "src/content.ts",
  output,
  plugins,
}

const popup = {
  input: "src/popup.ts",
  output,
  plugins,
}

export default [background, content, popup]
